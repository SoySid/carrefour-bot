import React from "react";
import { TrendingUp, TrendingDown, Minus, Calendar, ShoppingCart, ArrowUpRight, ArrowDownRight, Tag } from "lucide-react";
import { DailyStats } from "@/lib/types";

interface HeroStatsProps {
  stats: DailyStats;
}

export function HeroStats({ stats }: HeroStatsProps) {
  const isDayPositive = stats.varDiaGeneral > 0;
  const isDayNegative = stats.varDiaGeneral < 0;
  const isMonthPositive = stats.varMesGeneral > 0;

  // Cálculo de proporciones para la barra de distribución
  const totalMovs = (stats.subieronDia || 0) + (stats.bajaronDia || 0) + (stats.igualesDia || 0) || 1;
  const pctUp = Math.max(((stats.subieronDia || 0) / totalMovs) * 100, stats.subieronDia > 0 ? 1.5 : 0);
  const pctDown = Math.max(((stats.bajaronDia || 0) / totalMovs) * 100, stats.bajaronDia > 0 ? 1.5 : 0);
  const pctSame = 100 - pctUp - pctDown;

  return (
    <section id="canasta" className="space-y-6 pt-4 sm:pt-8">
      {/* Cabecera editorial limpia */}
      <div className="flex flex-col gap-3 max-w-3xl border-b border-surface-border pb-6">
        <div className="inline-flex items-center gap-2 rounded-md bg-surface-100 border border-white/10 px-2.5 py-1 text-xs font-mono text-zinc-300 w-fit">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Monitor de Precios • Carrefour Argentina</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Índice de Precios Carrefour
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
          Seguimiento diario sobre el catálogo oficial online con stock real disponible. Medición de precios finales al consumidor sin encuestas ni estimaciones teóricas.
        </p>
      </div>

      {/* Grid de Métricas Principales (Estilo Terminal Financiero) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta 1: Variación Diaria */}
        <div className="rounded-xl border border-surface-border bg-surface-100 p-5 transition-colors hover:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Variación Diaria (24h)
            </span>
            <div className="rounded-md bg-surface-200 p-1.5 text-zinc-400 border border-white/5">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${
                isDayPositive
                  ? "text-rose-400"
                  : isDayNegative
                  ? "text-emerald-400"
                  : "text-zinc-200"
              }`}
            >
              {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
            </span>
            <div className="flex items-center text-xs font-medium">
              {isDayPositive ? (
                <span className="inline-flex items-center gap-1 text-rose-400">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Suba diaria
                </span>
              ) : isDayNegative ? (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <ArrowDownRight className="h-3.5 w-3.5" /> Baja diaria
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Minus className="h-3.5 w-3.5" /> Sin variación
                </span>
              )}
            </div>
          </div>

          {/* Barra segmentada de distribución real */}
          <div className="mt-4">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
              <div style={{ width: `${pctUp}%` }} className="bg-rose-500" title={`${stats.subieronDia} subieron`} />
              <div style={{ width: `${pctDown}%` }} className="bg-emerald-500" title={`${stats.bajaronDia} bajaron`} />
              <div style={{ width: `${pctSame}%` }} className="bg-zinc-700" title={`${stats.igualesDia} estables`} />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="text-rose-400 font-semibold">{stats.subieronDia} subieron</span>
              <span className="text-emerald-400 font-semibold">{stats.bajaronDia} bajaron</span>
              <span className="text-zinc-400">{stats.igualesDia.toLocaleString("es-AR")} estables</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Acumulado del Mes */}
        <div className="rounded-xl border border-surface-border bg-surface-100 p-5 transition-colors hover:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Inflación del Mes
            </span>
            <div className="rounded-md bg-surface-200 p-1.5 text-zinc-400 border border-white/5">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${
                isMonthPositive
                  ? "text-rose-400"
                  : stats.varMesGeneral < 0
                  ? "text-emerald-400"
                  : "text-zinc-200"
              }`}
            >
              {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
            </span>
            <span className="text-xs text-zinc-400">
              acumulada en el mes
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-surface-200/80 px-3 py-2 text-xs border border-white/5">
            <span className="text-zinc-400">Período analizado</span>
            <span className="font-mono text-zinc-200 font-medium">01/10 ➔ Hoy</span>
          </div>
        </div>

        {/* Tarjeta 3: Universo Monitoreado */}
        <div className="rounded-xl border border-surface-border bg-surface-100 p-5 transition-colors hover:border-zinc-700/80 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Artículos Monitoreados
            </span>
            <div className="rounded-md bg-surface-200 p-1.5 text-zinc-400 border border-white/5">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
              {stats.totalMonitoreados.toLocaleString("es-AR")}
            </span>
            <span className="text-xs text-zinc-400">
              en stock activo
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-surface-200/80 px-3 py-2 text-xs border border-white/5">
            <span className="text-zinc-400">Cobertura</span>
            <span className="font-mono text-blue-400 font-medium">12 rubros auditados</span>
          </div>
        </div>
      </div>
    </section>
  );
}
