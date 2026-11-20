import { sql } from "./db";
import { DashboardData, ProductSearchResult, PricePoint, CategoryStat, ProductMover, ChanguitoItem } from "./types";

export const CATEGORY_WEIGHTS: Record<string, number> = {
  "Carnes y pescados": 0.22,
  "Almacén": 0.20,
  "Lácteos y productos frescos": 0.15,
  "Frutas y verduras": 0.10,
  "Panadería": 0.08,
  "Desayuno y merienda": 0.08,
  "Bebidas": 0.06,
  "Limpieza": 0.06,
  "Perfumería y farmacia": 0.03,
  "Congelados": 0.02,
};

const VALID_CATEGORIES = Object.keys(CATEGORY_WEIGHTS);

let cachedDashboard: { data: DashboardData; timestamp: number; key: string } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutos en memoria
const CURRENT_CACHE_KEY = "jevons_v2";

export async function getDashboardData(): Promise<DashboardData> {
  const now = Date.now();
  if (cachedDashboard && cachedDashboard.key === CURRENT_CACHE_KEY && now - cachedDashboard.timestamp < CACHE_TTL_MS) {
    return cachedDashboard.data;
  }

  // Obtener fechas clave de análisis buscando fechas únicas recientes
  const fechasResult = await sql`
    SELECT TO_CHAR(fecha, 'YYYY-MM-DD') AS f
    FROM historial_precios
    GROUP BY fecha
    ORDER BY fecha DESC
    LIMIT 35;
  `;

  const availableDates: string[] = (fechasResult || []).map((r: any) => String(r.f));
  const f_hoy = availableDates[0] || new Date().toISOString().split("T")[0];
  const f_ayer = availableDates[1] || "";
  
  // Buscar cierre del mes anterior como base mensual; si no existe, primer registro del mes corriente
  const prevMonthCloseRes = await sql`
    SELECT TO_CHAR(MAX(fecha), 'YYYY-MM-DD') AS f
    FROM historial_precios
    WHERE fecha < DATE_TRUNC('month', ${f_hoy}::date);
  `;
  const currentMonthPrefix = f_hoy.substring(0, 7);
  const monthDates = availableDates.filter((d) => d.startsWith(currentMonthPrefix));
  const f_mes = prevMonthCloseRes[0]?.f
    ? String(prevMonthCloseRes[0].f)
    : monthDates.length > 0
    ? monthDates[monthDates.length - 1]
    : f_ayer;

  // Resumen por rubros auditados (Índice de Jevons / media geométrica con recorte simétrico de outliers)
  const categoriasResult = await sql`
    WITH base_mes_ant AS (
      SELECT DISTINCT ON (hp.producto_id) hp.producto_id, hp.precio
      FROM historial_precios hp
      WHERE hp.fecha < DATE_TRUNC('month', ${f_hoy}::date) AND hp.precio > 0
      ORDER BY hp.producto_id, hp.fecha DESC
    ),
    base_mes_act AS (
      SELECT DISTINCT ON (hp.producto_id) hp.producto_id, hp.precio
      FROM historial_precios hp
      WHERE hp.fecha >= DATE_TRUNC('month', ${f_hoy}::date) AND hp.fecha <= ${f_hoy}::date AND hp.precio > 0
      ORDER BY hp.producto_id, hp.fecha ASC
    ),
    precios AS (
      SELECT 
        p.categoria,
        CASE WHEN h_ayer.precio > 0 THEN h_hoy.precio / h_ayer.precio ELSE NULL END AS ratio_dia,
        CASE WHEN COALESCE(b_ant.precio, b_act.precio) > 0 THEN h_hoy.precio / COALESCE(b_ant.precio, b_act.precio) ELSE NULL END AS ratio_mes
      FROM productos p
      JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
      LEFT JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer || null}::date
      LEFT JOIN base_mes_ant b_ant ON b_ant.producto_id = p.id
      LEFT JOIN base_mes_act b_act ON b_act.producto_id = p.id
      WHERE p.activo = TRUE 
        AND h_hoy.precio > 0 
        AND h_hoy.precio <= 100000
        AND p.categoria = ANY(${VALID_CATEGORIES})
    ),
    dia_stats AS (
      SELECT
        categoria,
        LN(ratio_dia) AS ln_dia,
        COUNT(*) OVER (PARTITION BY categoria) AS n_dia,
        PERCENT_RANK() OVER (PARTITION BY categoria ORDER BY LN(ratio_dia)) AS pr_dia
      FROM precios
      WHERE ratio_dia BETWEEN 0.5 AND 2.0
    ),
    mes_stats AS (
      SELECT
        categoria,
        LN(ratio_mes) AS ln_mes,
        COUNT(*) OVER (PARTITION BY categoria) AS n_mes,
        PERCENT_RANK() OVER (PARTITION BY categoria ORDER BY LN(ratio_mes)) AS pr_mes
      FROM precios
      WHERE ratio_mes BETWEEN 0.4 AND 2.5
    ),
    dia_agg AS (
      SELECT categoria, AVG(ln_dia)::float AS avg_ln_dia
      FROM dia_stats
      WHERE n_dia < 20 OR (pr_dia >= 0.025 AND pr_dia <= 0.975)
      GROUP BY categoria
    ),
    mes_agg AS (
      SELECT categoria, AVG(ln_mes)::float AS avg_ln_mes
      FROM mes_stats
      WHERE n_mes < 20 OR (pr_mes >= 0.025 AND pr_mes <= 0.975)
      GROUP BY categoria
    ),
    conteos AS (
      SELECT 
        categoria,
        COUNT(*)::int AS total_productos,
        COUNT(CASE WHEN ratio_dia > 1 AND ratio_dia <= 2.0 THEN 1 END)::int AS subieron,
        COUNT(CASE WHEN ratio_dia < 1 AND ratio_dia >= 0.5 THEN 1 END)::int AS bajaron,
        COUNT(CASE WHEN ratio_dia = 1 THEN 1 END)::int AS iguales
      FROM precios
      GROUP BY categoria
    )
    SELECT 
      c.categoria,
      c.total_productos,
      COALESCE(da.avg_ln_dia, 0.0)::float AS avg_ln_dia,
      COALESCE(ma.avg_ln_mes, 0.0)::float AS avg_ln_mes,
      COALESCE(ROUND(((EXP(da.avg_ln_dia) - 1) * 100)::numeric, 2), 0.00)::float AS var_dia,
      COALESCE(ROUND(((EXP(ma.avg_ln_mes) - 1) * 100)::numeric, 2), 0.00)::float AS var_mes,
      c.subieron,
      c.bajaron,
      c.iguales
    FROM conteos c
    LEFT JOIN dia_agg da ON da.categoria = c.categoria
    LEFT JOIN mes_agg ma ON ma.categoria = c.categoria;
  `;

  const categoriasWithLogs = (categoriasResult || []).map((row: any) => {
    const catName = String(row.categoria || "");
    return {
      categoria: catName,
      peso: CATEGORY_WEIGHTS[catName] || 0.0,
      totalProductos: Number(row.total_productos || 0),
      avgLnDia: Number(row.avg_ln_dia || 0),
      avgLnMes: Number(row.avg_ln_mes || 0),
      varDia: Number(row.var_dia || 0),
      varMes: Number(row.var_mes || 0),
      subieron: Number(row.subieron || 0),
      bajaron: Number(row.bajaron || 0),
      iguales: Number(row.iguales || 0),
    };
  });

  // Cálculo ponderado general en escala logarítmica (Índice de Jevons ponderado)
  const totalPeso = categoriasWithLogs.reduce((acc, c) => acc + (c.peso || 0), 0) || 1.0;
  const avgLogDiaGeneral = categoriasWithLogs.reduce((acc, c) => acc + c.avgLnDia * c.peso, 0) / totalPeso;
  const avgLogMesGeneral = categoriasWithLogs.reduce((acc, c) => acc + c.avgLnMes * c.peso, 0) / totalPeso;
  const varDiaPonderada = Number(((Math.exp(avgLogDiaGeneral) - 1) * 100).toFixed(2));
  const varMesPonderada = Number(((Math.exp(avgLogMesGeneral) - 1) * 100).toFixed(2));

  const categoriasParsed: CategoryStat[] = categoriasWithLogs.map(({ avgLnDia: _d, avgLnMes: _m, ...rest }) => rest);

  const totalMonitoreados = categoriasParsed.reduce((acc, c) => acc + c.totalProductos, 0);
  const subieronTotal = categoriasParsed.reduce((acc, c) => acc + c.subieron, 0);
  const bajaronTotal = categoriasParsed.reduce((acc, c) => acc + c.bajaron, 0);
  const igualesTotal = categoriasParsed.reduce((acc, c) => acc + c.iguales, 0);

  // Mayores aumentos del día (filtrando errores de carga > 100%)
  const subasResult = await sql`
    SELECT 
      p.id,
      p.nombre,
      p.categoria,
      p.url,
      h_hoy.precio::float AS precio_hoy,
      h_ayer.precio::float AS precio_ayer,
      ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2)::float AS var_dia
    FROM productos p
    JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
    JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer}::date
    WHERE p.activo = TRUE 
      AND h_hoy.precio > 0 
      AND h_hoy.precio <= 100000
      AND h_ayer.precio > 0
      AND h_hoy.precio > h_ayer.precio
      AND ((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100 <= 100
      AND p.categoria = ANY(${VALID_CATEGORIES})
    ORDER BY var_dia DESC
    LIMIT 6;
  `;

  // Mayores bajas / ofertas del día (filtrando caídas irreales > -50%)
  const bajasResult = await sql`
    SELECT 
      p.id,
      p.nombre,
      p.categoria,
      p.url,
      h_hoy.precio::float AS precio_hoy,
      h_ayer.precio::float AS precio_ayer,
      ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2)::float AS var_dia
    FROM productos p
    JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
    JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer}::date
    WHERE p.activo = TRUE 
      AND h_hoy.precio > 0 
      AND h_hoy.precio <= 100000
      AND h_ayer.precio > 0
      AND h_hoy.precio < h_ayer.precio
      AND ((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100 >= -50
      AND p.categoria = ANY(${VALID_CATEGORIES})
    ORDER BY var_dia ASC
    LIMIT 6;
  `;

  // Canasta Básica de Primeras Marcas: La Serenísima, Natura, Matarazzo, Gallo Oro, Pureza y Taragüí
  const STAPLE_IDS = ['720719', '332888', '726304', '733186', '551284', '668369'];
  const changuitoResult = await sql`
    SELECT 
      p.id,
      p.nombre,
      p.categoria,
      p.url,
      h_hoy.precio::float AS precio_hoy,
      COALESCE(h_ayer.precio, h_hoy.precio)::float AS precio_ayer,
      COALESCE(ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2), 0.00)::float AS var_dia
    FROM productos p
    JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
    LEFT JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer}::date
    WHERE p.id::text = ANY(${STAPLE_IDS})
    ORDER BY p.categoria ASC;
  `;

  const dashboardPayload: DashboardData = {
    stats: {
      fechaHoy: f_hoy,
      fechaAyer: f_ayer,
      fechaMes: f_mes,
      totalMonitoreados,
      conVarDia: subieronTotal + bajaronTotal + igualesTotal,
      varDiaGeneral: varDiaPonderada,
      varMesGeneral: varMesPonderada,
      subieronDia: subieronTotal,
      bajaronDia: bajaronTotal,
      igualesDia: igualesTotal,
    },
    categorias: categoriasParsed.sort((a, b) => b.varMes - a.varMes),
    topSubas: (subasResult || []).map((row: any) => ({
      id: String(row.id),
      nombre: String(row.nombre || ""),
      categoria: String(row.categoria || ""),
      url: String(row.url || ""),
      precioHoy: Number(row.precio_hoy || 0),
      precioAyer: Number(row.precio_ayer || 0),
      varDia: Number(row.var_dia || 0),
    })),
    topBajas: (bajasResult || []).map((row: any) => ({
      id: String(row.id),
      nombre: String(row.nombre || ""),
      categoria: String(row.categoria || ""),
      url: String(row.url || ""),
      precioHoy: Number(row.precio_hoy || 0),
      precioAyer: Number(row.precio_ayer || 0),
      varDia: Number(row.var_dia || 0),
    })),
    changuito: (changuitoResult || []).map((row: any) => ({
      id: String(row.id),
      nombre: String(row.nombre || ""),
      categoria: String(row.categoria || ""),
      url: String(row.url || ""),
      precioHoy: Number(row.precio_hoy || 0),
      precioAyer: Number(row.precio_ayer || 0),
      varDia: Number(row.var_dia || 0),
    })),
  };

  cachedDashboard = {
    data: dashboardPayload,
    timestamp: now,
    key: CURRENT_CACHE_KEY,
  };

  return dashboardPayload;
}

let cachedDates: { f_hoy: string; f_ayer: string; timestamp: number } | null = null;

async function getLatestDates(): Promise<{ f_hoy: string; f_ayer: string }> {
  const now = Date.now();
  if (cachedDates && now - cachedDates.timestamp < 1000 * 60 * 10) {
    return cachedDates;
  }

  const res = await sql`
    SELECT 
      TO_CHAR(MAX(fecha), 'YYYY-MM-DD') AS f_hoy,
      TO_CHAR((SELECT MAX(fecha) FROM historial_precios WHERE fecha < (SELECT MAX(fecha) FROM historial_precios)), 'YYYY-MM-DD') AS f_ayer
    FROM historial_precios;
  `;

  const row = res[0] || {};
  cachedDates = {
    f_hoy: row.f_hoy || new Date().toISOString().split("T")[0],
    f_ayer: row.f_ayer || "",
    timestamp: now,
  };
  return cachedDates;
}

function escapeLikePattern(str: string): string {
  return str.replace(/([%_\\])/g, "\\$1");
}

export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  const term = query.trim().slice(0, 60);
  if (!term || term.length < 2) return [];

  const { f_hoy, f_ayer } = await getLatestDates();
  const escapedTerm = escapeLikePattern(term);
  const cleanQuery = `%${escapedTerm}%`;
  const prefixQuery = `${escapedTerm}%`;

  const results = await sql`
    WITH matched AS (
      SELECT id, nombre, categoria, url, imagen_url
      FROM productos
      WHERE activo = TRUE 
        AND (nombre ILIKE ${cleanQuery} OR categoria ILIKE ${cleanQuery})
      ORDER BY (nombre ILIKE ${prefixQuery}) DESC, nombre ASC
      LIMIT 20
    )
    SELECT 
      m.id,
      m.nombre,
      m.categoria,
      m.url,
      m.imagen_url,
      h_hoy.precio::float AS precio_actual,
      CASE 
        WHEN h_ayer.precio IS NOT NULL AND h_ayer.precio > 0 
        THEN ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2)::float 
        ELSE NULL 
      END AS var_dia
    FROM matched m
    LEFT JOIN historial_precios h_hoy ON h_hoy.producto_id = m.id AND h_hoy.fecha = ${f_hoy}::date
    LEFT JOIN historial_precios h_ayer ON h_ayer.producto_id = m.id AND h_ayer.fecha = ${f_ayer}::date
    ORDER BY (m.nombre ILIKE ${prefixQuery}) DESC, m.nombre ASC;
  `;

  return (results || []).map((row: any) => ({
    id: String(row.id),
    nombre: String(row.nombre || ""),
    categoria: String(row.categoria || ""),
    url: String(row.url || ""),
    imagenUrl: row.imagen_url ? String(row.imagen_url) : null,
    precioActual: Number(row.precio_actual || 0),
    varDia: row.var_dia !== null && row.var_dia !== undefined ? Number(row.var_dia) : null,
  }));
}

export async function getProductHistory(productId: string): Promise<PricePoint[]> {
  const cleanId = String(productId || "").trim().slice(0, 30);
  if (!cleanId || !/^[a-zA-Z0-9_-]+$/.test(cleanId)) return [];

  const results = await sql`
    SELECT 
      TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha,
      precio::float AS precio
    FROM historial_precios
    WHERE producto_id = ${productId} AND precio > 0
    ORDER BY fecha ASC
    LIMIT 60;
  `;

  return (results || []).map((row: any) => ({
    fecha: String(row.fecha),
    precio: Number(row.precio || 0),
  }));
}
