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
    <section id="canasta" className="space-y-8 pt-6 sm:pt-10">
      <div className="flex flex-col gap-4 max-w-4xl animate-enter">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          Índice de Precios Carrefour
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
          Seguimiento diario sobre los precios publicados en la tienda online de Carrefour Argentina para productos con stock disponible.
        </p>
      </div>

      <div data-ui="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Métrica 1: Variación Diaria */}
        <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-7 animate-enter delay-150">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${
                isDayPositive
                  ? "text-rose-400"
                  : isDayNegative
                  ? "text-emerald-400"
                  : "text-white"
              }`}
            >
              {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
            </span>
            <span className="text-sm font-semibold text-slate-300">
              {isDayPositive ? "Suba diaria" : isDayNegative ? "Baja diaria" : "Estable"}
            </span>
          </div>

          <p className="mt-2 text-base font-medium text-slate-400">
            Variación general en 24 horas
          </p>

          {/* Barra de distribución con animación */}
          <div className="mt-6">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-200">
              <div
                style={{ width: `${pctUp}%` }}
                className="bg-rose-500 transition-[width] duration-500"
                title={`${stats.subieronDia} subieron`}
              />
              <div
                style={{ width: `${pctDown}%` }}
                className="bg-emerald-500 transition-[width] duration-500"
                title={`${stats.bajaronDia} bajaron`}
              />
              <div
                style={{ width: `${pctSame}%` }}
                className="bg-slate-600 transition-[width] duration-500"
                title={`${stats.igualesDia} estables`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-base text-slate-400 tabular-nums">
              <span className="text-rose-400 font-medium">{stats.subieronDia} subieron</span>
              <span className="text-emerald-400 font-medium">{stats.bajaronDia} bajaron</span>
              <span className="text-slate-400">{stats.igualesDia.toLocaleString("es-AR")} sin cambios</span>
            </div>
          </div>
        </div>

        {/* Métrica 2: Acumulado del Mes */}
        <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-7 animate-enter delay-225">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${
                isMonthPositive
                  ? "text-rose-400"
                  : stats.varMesGeneral < 0
                  ? "text-emerald-400"
                  : "text-white"
              }`}
            >
              {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
            </span>
            <span className="text-base font-medium text-slate-400">
              en el mes
            </span>
          </div>

          <p className="mt-2 text-base font-medium text-slate-400">
            Inflación acumulada del mes
          </p>

          <div className="mt-8 flex items-center justify-between rounded-xl bg-surface-200/50 border border-surface-200 px-4 py-3 text-base">
            <span className="text-slate-400">Período de cálculo</span>
            <span className="text-white font-semibold tabular-nums">Desde el 1 del mes a hoy</span>
          </div>
        </div>

        {/* Métrica 3: Artículos Relevados */}
        <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-7 sm:col-span-2 lg:col-span-1 animate-enter delay-300">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums">
              {stats.totalMonitoreados.toLocaleString("es-AR")}
            </span>
            <span className="text-base font-medium text-slate-400">
              artículos
            </span>
          </div>

          <p className="mt-2 text-base font-medium text-slate-400">
            Productos con stock disponible
          </p>

          <div className="mt-8 flex items-center justify-between rounded-xl bg-surface-200/50 border border-surface-200 px-4 py-3 text-base">
            <span className="text-slate-400">Cobertura</span>
            <span className="text-brand-400 font-semibold">12 rubros de góndola</span>
          </div>
        </div>
      </div>
    </section>
  );
}
