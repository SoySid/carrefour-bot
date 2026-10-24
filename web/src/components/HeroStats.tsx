import React from "react";
import { ShoppingBasket, Activity } from "lucide-react";
import { DailyStats, ChanguitoItem } from "@/lib/types";

interface HeroStatsProps {
  stats: DailyStats;
  changuito?: ChanguitoItem[];
}

export function HeroStats({ stats, changuito = [] }: HeroStatsProps) {
  const isDayPositive = stats.varDiaGeneral > 0;
  const isDayNegative = stats.varDiaGeneral < 0;

  const totalMovs = (stats.subieronDia || 0) + (stats.bajaronDia || 0) + (stats.igualesDia || 0) || 1;
  const pctSubieron = ((stats.subieronDia || 0) / totalMovs) * 100;
  const pctBajaron = ((stats.bajaronDia || 0) / totalMovs) * 100;
  const pctCongelados = ((stats.igualesDia || 0) / totalMovs) * 100;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalChanguitoHoy = changuito.reduce((acc, it) => acc + (it.precioHoy || 0), 0);
  const totalChanguitoAyer = changuito.reduce((acc, it) => acc + (it.precioAyer || 0), 0);
  const varChanguito = totalChanguitoAyer > 0
    ? (((totalChanguitoHoy - totalChanguitoAyer) / totalChanguitoAyer) * 100).toFixed(1)
    : "0.0";

  return (
    <section className="space-y-6 pt-2 sm:pt-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400">
          <Activity className="h-3.5 w-3.5" />
          <span>Monitor diario de góndola</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 text-balance">
          Precios al consumidor en Carrefour
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl text-balance">
          Relevamiento diario de precios para productos con stock real en la tienda online.
        </p>
      </div>

      {/* Tablero de Góndola */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Variación General y Dispersión */}
        <div className="lg:col-span-7 rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Variación ponderada por rubro
            </span>
            <div className="mt-3 flex flex-wrap items-baseline gap-4">
              <span
                className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight tabular-nums ${
                  isDayPositive
                    ? "text-rose-400"
                    : isDayNegative
                    ? "text-emerald-400"
                    : "text-slate-100"
                }`}
              >
                {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">
                  {isDayPositive ? "Promedio de suba en 24h" : isDayNegative ? "Promedio de baja en 24h" : "Sin variación neta"}
                </span>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  Acumulado este mes:{" "}
                  <strong className={stats.varMesGeneral >= 0 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Barra de Dispersión sin subcajas anidadas */}
          <div className="space-y-2.5 pt-4 border-t border-surface-border/60">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Movimiento de precios hoy</span>
              <span className="font-mono text-slate-400 tabular-nums">
                {stats.totalMonitoreados.toLocaleString("es-AR")} artículos relevados
              </span>
            </div>

            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-200">
              <div
                style={{ width: `${Math.max(pctSubieron, stats.subieronDia > 0 ? 2 : 0)}%` }}
                className="bg-rose-500 transition-all duration-300"
                title={`${stats.subieronDia} subieron`}
              />
              <div
                style={{ width: `${Math.max(pctBajaron, stats.bajaronDia > 0 ? 2 : 0)}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`${stats.bajaronDia} bajaron`}
              />
              <div
                style={{ width: `${pctCongelados}%` }}
                className="bg-slate-700 transition-all duration-300"
                title={`${stats.igualesDia} sin cambios`}
              />
            </div>

            {/* Fila limpia de datos directos, sin cajas adentro */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs tabular-nums text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-400 font-sans">Subieron:</span>
                <span className="font-bold text-rose-400">+{stats.subieronDia}</span>
                <span className="text-slate-400 text-[11px]">({pctSubieron.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400 font-sans">Bajaron:</span>
                <span className="font-bold text-emerald-400">-{stats.bajaronDia}</span>
                <span className="text-slate-400 text-[11px]">({pctBajaron.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="text-slate-400 font-sans">Sin cambios:</span>
                <span className="font-bold text-slate-200">{stats.igualesDia.toLocaleString("es-AR")}</span>
                <span className="text-slate-400 text-[11px]">({pctCongelados.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Canasta Testigo de 6 alimentos */}
        <div className="lg:col-span-5 rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="h-4 w-4 text-brand-400" />
                <h2 className="text-sm font-bold text-slate-100">
                  Canasta de 6 alimentos básicos
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {changuito.length} productos
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Leche, aceite, arroz, fideos, harina y yerba mate.
            </p>

            <div className="mt-3 flex items-baseline justify-between border-b border-surface-border/60 pb-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Total de la canasta</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
                  {formatCurrency(totalChanguitoHoy)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Variación 24h</span>
                <span className={`text-xs font-mono font-bold tabular-nums ${
                  Number(varChanguito) > 0 ? "text-rose-400" : Number(varChanguito) < 0 ? "text-emerald-400" : "text-slate-300"
                }`}>
                  {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`}
                </span>
              </div>
            </div>

            {/* Lista directa de alimentos sin tarjetas anidadas */}
            <div className="mt-2 divide-y divide-surface-border/40">
              {changuito.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Cargando productos de la canasta...
                </p>
              ) : (
                changuito.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="text-slate-200 block truncate font-medium text-xs" title={item.nombre}>
                        {item.nombre}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.categoria}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-100 tabular-nums flex-shrink-0 text-sm">
                      {formatCurrency(item.precioHoy)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-surface-border/60">
            <span>Precios vigentes al corte de hoy</span>
            <span className="font-mono text-slate-400">Stock activo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
