import { sql } from "./db";
import { DashboardData, ProductSearchResult, PricePoint, CategoryStat, ProductMover } from "./types";

export async function getDashboardData(): Promise<DashboardData> {
  // Obtener fechas clave de análisis
  const fechasResult = await sql`
    WITH fechas AS (
      SELECT 
        MAX(fecha) AS f_hoy,
        (SELECT MAX(fecha) FROM historial_precios WHERE fecha < (SELECT MAX(fecha) FROM historial_precios)) AS f_ayer,
        (SELECT MIN(fecha) FROM historial_precios WHERE fecha >= DATE_TRUNC('month', (SELECT MAX(fecha) FROM historial_precios))) AS f_mes
      FROM historial_precios
    )
    SELECT 
      TO_CHAR(f_hoy, 'YYYY-MM-DD') AS f_hoy,
      TO_CHAR(f_ayer, 'YYYY-MM-DD') AS f_ayer,
      TO_CHAR(f_mes, 'YYYY-MM-DD') AS f_mes
    FROM fechas;
  `;

  const { f_hoy, f_ayer, f_mes } = fechasResult[0] || {
    f_hoy: new Date().toISOString().split("T")[0],
    f_ayer: "",
    f_mes: "",
  };

  // Resumen general de la canasta
  const statsResult = await sql`
    WITH precios AS (
      SELECT 
        p.id,
        h_hoy.precio AS precio_hoy,
        h_ayer.precio AS precio_ayer,
        h_mes.precio AS precio_mes,
        ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2) AS var_dia,
        ROUND(((h_hoy.precio - h_mes.precio) / h_mes.precio) * 100, 2) AS var_mes
      FROM productos p
      JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
      LEFT JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer}::date
      LEFT JOIN historial_precios h_mes ON h_mes.producto_id = p.id AND h_mes.fecha = ${f_mes}::date
      WHERE p.activo = TRUE AND h_hoy.precio > 0
    )
    SELECT 
      COUNT(*)::int AS total_monitoreados,
      COUNT(var_dia)::int AS con_var_dia,
      COALESCE(ROUND(AVG(var_dia), 2), 0.00)::float AS avg_var_dia,
      COALESCE(ROUND(AVG(var_mes), 2), 0.00)::float AS avg_var_mes,
      COUNT(CASE WHEN var_dia > 0 THEN 1 END)::int AS subieron,
      COUNT(CASE WHEN var_dia < 0 THEN 1 END)::int AS bajaron,
      COUNT(CASE WHEN var_dia = 0 THEN 1 END)::int AS iguales
    FROM precios;
  `;

  const s = statsResult[0] || {};

  // Resumen por categorías
  const categoriasResult = await sql`
    WITH precios AS (
      SELECT 
        p.categoria,
        h_hoy.precio AS precio_hoy,
        h_ayer.precio AS precio_ayer,
        h_mes.precio AS precio_mes,
        ROUND(((h_hoy.precio - h_ayer.precio) / h_ayer.precio) * 100, 2) AS var_dia,
        ROUND(((h_hoy.precio - h_mes.precio) / h_mes.precio) * 100, 2) AS var_mes
      FROM productos p
      JOIN historial_precios h_hoy ON h_hoy.producto_id = p.id AND h_hoy.fecha = ${f_hoy}::date
      LEFT JOIN historial_precios h_ayer ON h_ayer.producto_id = p.id AND h_ayer.fecha = ${f_ayer}::date
      LEFT JOIN historial_precios h_mes ON h_mes.producto_id = p.id AND h_mes.fecha = ${f_mes}::date
      WHERE p.activo = TRUE AND h_hoy.precio > 0 AND p.categoria IS NOT NULL
    )
    SELECT 
      categoria,
      COUNT(*)::int AS total_productos,
      COALESCE(ROUND(AVG(var_dia), 2), 0.00)::float AS var_dia,
      COALESCE(ROUND(AVG(var_mes), 2), 0.00)::float AS var_mes,
      COUNT(CASE WHEN var_dia > 0 THEN 1 END)::int AS subieron,
      COUNT(CASE WHEN var_dia < 0 THEN 1 END)::int AS bajaron,
      COUNT(CASE WHEN var_dia = 0 THEN 1 END)::int AS iguales
    FROM precios
    GROUP BY categoria
    ORDER BY var_mes DESC;
  `;

  // Mayores aumentos del día
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
      AND h_ayer.precio > 0
      AND h_hoy.precio > h_ayer.precio
    ORDER BY var_dia DESC
    LIMIT 6;
  `;

  // Mayores bajas / ofertas del día
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
      AND h_ayer.precio > 0
      AND h_hoy.precio < h_ayer.precio
    ORDER BY var_dia ASC
    LIMIT 6;
  `;

  return {
    stats: {
      fechaHoy: f_hoy,
      fechaAyer: f_ayer,
      fechaMes: f_mes,
      totalMonitoreados: Number(s.total_monitoreados || 0),
      conVarDia: Number(s.con_var_dia || 0),
      varDiaGeneral: Number(s.avg_var_dia || 0),
      varMesGeneral: Number(s.avg_var_mes || 0),
      subieronDia: Number(s.subieron || 0),
      bajaronDia: Number(s.bajaron || 0),
      igualesDia: Number(s.iguales || 0),
    },
    categorias: (categoriasResult || []).map((row: any) => ({
      categoria: String(row.categoria || ""),
      totalProductos: Number(row.total_productos || 0),
      varDia: Number(row.var_dia || 0),
      varMes: Number(row.var_mes || 0),
      subieron: Number(row.subieron || 0),
      bajaron: Number(row.bajaron || 0),
      iguales: Number(row.iguales || 0),
    })),
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
  };
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

export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  const term = query.trim();
  if (!term || term.length < 2) return [];

  const { f_hoy, f_ayer } = await getLatestDates();
  const cleanQuery = `%${term}%`;
  const prefixQuery = `${term}%`;

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
  if (!productId) return [];

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
