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
    <section id="canasta" className="space-y-4 pt-4 sm:pt-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Índice de Precios Carrefour
        </h1>
        <p className="text-sm text-slate-400">
          Monitoreo automatizado sobre el catálogo oficial con stock real disponible en Carrefour Argentina.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta 1: Variación Diaria */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Variación Diaria (Canasta)
            </span>
            <div className="rounded-lg bg-surface-200 p-2 text-slate-300">
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
                <span className="flex items-center text-rose-400">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" /> Suba general
                </span>
              ) : isDayNegative ? (
                <span className="flex items-center text-emerald-400">
                  <TrendingDown className="mr-1 h-3.5 w-3.5" /> Baja promedio
                </span>
              ) : (
                <span className="flex items-center text-slate-400">
                  <Minus className="mr-1 h-3.5 w-3.5" /> Estable
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-border/60 pt-3 text-xs">
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
              <span>{stats.igualesDia.toLocaleString("es-AR")} sin cambio</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Acumulado del Mes */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Acumulado del Mes
            </span>
            <div className="rounded-lg bg-surface-200 p-2 text-slate-300">
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
              Desde el 1° del mes
            </span>
          </div>

          <div className="mt-4 border-t border-surface-border/60 pt-3 text-xs text-slate-400">
            Base calculada con los precios de apertura del mes sobre los artículos coincidentes.
          </div>
        </div>

        {/* Tarjeta 3: Muestra de Productos Monitoreados */}
        <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-100 p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Muestra Auditada Hoy
            </span>
            <div className="rounded-lg bg-surface-200 p-2 text-slate-300">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              {stats.totalMonitoreados.toLocaleString("es-AR")}
            </span>
            <span className="text-xs text-slate-400">
              artículos con stock
            </span>
          </div>

          <div className="mt-4 border-t border-surface-border/60 pt-3 text-xs text-slate-400">
            Excluye marketplace de terceros y productos sin disponibilidad inmediata.
          </div>
        </div>
      </div>
    </section>
  );
}
