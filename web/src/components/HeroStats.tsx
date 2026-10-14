import React from "react";
import { TrendingUp, TrendingDown, Minus, Layers, Calendar, ShoppingCart } from "lucide-react";
import { DailyStats } from "@/lib/types";

interface HeroStatsProps {
  stats: DailyStats;
}

export function HeroStats({ stats }: HeroStatsProps) {
  const isDayPositive = stats.varDiaGeneral > 0;
  const isDayNegative = stats.varDiaGeneral < 0;

  const isMonthPositive = stats.varMesGeneral > 0;

  return (
    <section id="canasta" className="space-y-6 pt-4 sm:pt-8">
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-400 ring-1 ring-inset ring-brand-500/25">
            <ShoppingCart className="h-3.5 w-3.5" /> Relevamiento de Góndola
          </span>
          <span className="text-xs text-slate-500">
            • Carrefour Argentina
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">
          Inflación diaria en el supermercado
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Seguimiento de precios sobre más de 11.800 artículos con stock disponible para saber con exactitud qué subió, qué bajó y cómo cambia la canasta real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta 1: Variación Diaria */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Variación Diaria
            </span>
            <div className="rounded-lg bg-surface-200 p-1.5 text-slate-300">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span
              className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
                isDayPositive
                  ? "text-rose-400"
                  : isDayNegative
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
            </span>
            <div className="flex items-center text-xs font-medium text-slate-400">
              {isDayPositive ? (
                <span className="flex items-center text-rose-400 font-medium">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" /> Suba promedio
                </span>
              ) : isDayNegative ? (
                <span className="flex items-center text-emerald-400 font-medium">
                  <TrendingDown className="mr-1 h-3.5 w-3.5" /> Baja promedio
                </span>
              ) : (
                <span className="flex items-center text-slate-400 font-medium">
                  <Minus className="mr-1 h-3.5 w-3.5" /> Sin cambio
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-surface-border/60 pt-3 text-xs">
            <div className="flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-rose-300 font-medium ring-1 ring-rose-500/20">
              <TrendingUp className="h-3 w-3" />
              <span>{stats.subieronDia} subieron</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-300 font-medium ring-1 ring-emerald-500/20">
              <TrendingDown className="h-3 w-3" />
              <span>{stats.bajaronDia} bajaron</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-surface-200 px-2 py-0.5 text-slate-400 font-medium">
              <Minus className="h-3 w-3" />
              <span>{stats.igualesDia.toLocaleString("es-AR")} estables</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Acumulado del Mes */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Inflación del Mes
            </span>
            <div className="rounded-lg bg-surface-200 p-1.5 text-slate-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span
              className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
                isMonthPositive
                  ? "text-rose-400"
                  : stats.varMesGeneral < 0
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
            </span>
            <span className="text-xs text-slate-400">
              en el mes en curso
            </span>
          </div>

          <div className="mt-4 border-t border-surface-border/60 pt-3 text-xs text-slate-400">
            Comparación directa con el corte del primer día del mes sobre los productos coincidentes.
          </div>
        </div>

        {/* Tarjeta 3: Muestra de Productos Monitoreados */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Productos Relevados
            </span>
            <div className="rounded-lg bg-surface-200 p-1.5 text-slate-300">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              {stats.totalMonitoreados.toLocaleString("es-AR")}
            </span>
            <span className="text-xs text-slate-400">
              en stock para compra hoy
            </span>
          </div>

          <div className="mt-4 border-t border-surface-border/60 pt-3 text-xs text-slate-400">
            Exclusivo productos vendidos por Carrefour oficial con entrega inmediata.
          </div>
        </div>
      </div>
    </section>
  );
}
