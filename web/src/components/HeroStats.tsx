import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, ShoppingBasket, Activity } from "lucide-react";
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
    <section className="space-y-6 pt-4 sm:pt-8">
      {/* Encabezado Editorial */}
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Activity className="h-3.5 w-3.5 text-brand-400" />
          <span>Monitor de Góndola y Canasta Familiar</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-100 text-balance">
          Precios al Consumidor en Carrefour
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl text-balance">
          Medición diaria e independiente calculada sobre artículos de consumo masivo con stock activo en Carrefour Argentina.
        </p>
      </div>

      {/* Bloque Asimétrico: Tablero Central */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Indicadores de Inflación (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-7 space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Variación de la Canasta (Ponderación estilo IPC)
            </span>
            <div className="mt-3 flex flex-wrap items-baseline gap-4">
              <span
                className={`text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums ${
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
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {isDayPositive ? "Suba promedio en 24h" : isDayNegative ? "Baja promedio en 24h" : "Sin variación neta"}
                </span>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  Acumulado mes actual:{" "}
                  <strong className={stats.varMesGeneral >= 0 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Termómetro de Dispersión */}
          <div className="space-y-2.5 pt-4 border-t border-surface-border">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-slate-400">Dispersión de precios hoy</span>
              <span className="font-mono text-slate-400 tabular-nums">
                {stats.totalMonitoreados.toLocaleString("es-AR")} artículos auditados
              </span>
            </div>

            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-200">
              <div
                style={{ width: `${Math.max(pctSubieron, stats.subieronDia > 0 ? 2 : 0)}%` }}
                className="bg-rose-500 transition-all duration-300"
                title={`${stats.subieronDia} subieron (${pctSubieron.toFixed(1)}%)`}
              />
              <div
                style={{ width: `${Math.max(pctBajaron, stats.bajaronDia > 0 ? 2 : 0)}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`${stats.bajaronDia} bajaron (${pctBajaron.toFixed(1)}%)`}
              />
              <div
                style={{ width: `${pctCongelados}%` }}
                className="bg-slate-700 transition-all duration-300"
                title={`${stats.igualesDia} sin cambios (${pctCongelados.toFixed(1)}%)`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs tabular-nums">
              <div className="rounded bg-surface-200/50 p-2 border border-surface-border">
                <span className="block text-slate-400 text-[11px]">Subieron</span>
                <span className="font-bold text-rose-400">+{stats.subieronDia}</span>
                <span className="block text-[10px] text-slate-400">({pctSubieron.toFixed(1)}%)</span>
              </div>
              <div className="rounded bg-surface-200/50 p-2 border border-surface-border">
                <span className="block text-slate-400 text-[11px]">Bajaron / Oferta</span>
                <span className="font-bold text-emerald-400">-{stats.bajaronDia}</span>
                <span className="block text-[10px] text-slate-400">({pctBajaron.toFixed(1)}%)</span>
              </div>
              <div className="rounded bg-surface-200/50 p-2 border border-surface-border">
                <span className="block text-slate-400 text-[11px]">Congelados</span>
                <span className="font-bold text-slate-200">{stats.igualesDia.toLocaleString("es-AR")}</span>
                <span className="block text-[10px] text-slate-400">({pctCongelados.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Canasta Testigo "El Changuito" (5 columnas) */}
        <div className="lg:col-span-5 rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="h-4 w-4 text-brand-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Canasta Testigo Esencial
                </h2>
              </div>
              <span className="text-xs rounded bg-surface-200 px-2 py-0.5 text-slate-300 border border-surface-border">
                6 artículos
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Seguimiento de alimentos básicos de consumo frecuente en góndola.
            </p>

            <div className="mt-4 flex items-baseline justify-between border-b border-surface-border pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Total Canasta Testigo</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
                  {formatCurrency(totalChanguitoHoy)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Var. 24h</span>
                <span className={`text-xs font-mono font-bold tabular-nums ${
                  Number(varChanguito) > 0 ? "text-rose-400" : Number(varChanguito) < 0 ? "text-emerald-400" : "text-slate-300"
                }`}>
                  {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`}
                </span>
              </div>
            </div>

            {/* Listado de items del Changuito */}
            <div className="mt-3 space-y-2">
              {changuito.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Cargando artículos testigo...
                </p>
              ) : (
                changuito.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-surface-border/50">
                    <span className="text-slate-300 truncate max-w-[200px]" title={item.nombre}>
                      {item.nombre}
                    </span>
                    <span className="font-mono font-semibold text-slate-100 tabular-nums flex-shrink-0">
                      {formatCurrency(item.precioHoy)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-surface-border">
            <span>Cálculo transparente directo de góndola</span>
            <span className="font-mono text-slate-400">100% stock real</span>
          </div>
        </div>
      </div>
    </section>
  );
}
