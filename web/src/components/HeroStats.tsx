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
    <section id="canasta" className="relative space-y-8 pt-4 sm:pt-8">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-600/20 via-sky-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Cabecera del Hero con logotipo y titular moderno */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-surface-border/60 pb-8">
        <div className="flex flex-col gap-3.5 max-w-2xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 w-fit backdrop-blur-md">
            <div className="h-4 w-4 overflow-hidden rounded bg-white p-0.5 shadow-sm">
              <img
                src="/logo.jpg"
                alt="Scanner Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span>Relevamiento Diario Oficial • Carrefour Argentina</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
            Inflación diaria en <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              el supermercado
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl">
            Seguimiento de precios sobre más de 11.800 artículos con stock disponible para saber con exactitud qué subió, qué bajó y cómo cambia la canasta real.
          </p>
        </div>

        {/* Tarjeta gráfica del escáner con efecto láser */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-surface-100 to-slate-950/80 shadow-2xl backdrop-blur-xl group hover:border-blue-400/60 transition-all">
          <div className="relative w-36 h-36 overflow-hidden rounded-xl bg-white p-2 shadow-inner">
            <img
              src="/logo.jpg"
              alt="Scanner de Precios"
              className="h-full w-full object-contain rounded-lg"
            />
            {/* Animación del haz láser de escaneo */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-laser pointer-events-none" />
          </div>
          <div className="mt-3 text-center">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-300">
              Escaneo Automatizado
            </span>
            <span className="text-[10px] text-slate-400">
              API oficial VTEX sin intermediarios
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid: 3 Tarjetas Principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta 1: Variación Diaria */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-surface-100 to-slate-950/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(0,102,204,0.15)] group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Variación Diaria
            </span>
            <div className="rounded-lg bg-surface-200/80 p-2 text-slate-300 border border-white/5">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${
                isDayPositive
                  ? "text-rose-400"
                  : isDayNegative
                  ? "text-emerald-400"
                  : "text-slate-200"
              }`}
            >
              {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
            </span>
            <div className="flex items-center text-xs font-semibold">
              {isDayPositive ? (
                <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Suba promedio
                </span>
              ) : isDayNegative ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <ArrowDownRight className="h-3.5 w-3.5" /> Baja promedio
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-md border border-slate-500/20">
                  <Minus className="h-3.5 w-3.5" /> Sin cambio
                </span>
              )}
            </div>
          </div>

          {/* Barra visual de distribución proporcional */}
          <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div style={{ width: `${pctUp}%` }} className="bg-rose-500 transition-all" title={`${stats.subieronDia} subieron`} />
            <div style={{ width: `${pctDown}%` }} className="bg-emerald-500 transition-all" title={`${stats.bajaronDia} bajaron`} />
            <div style={{ width: `${pctSame}%` }} className="bg-slate-700 transition-all" title={`${stats.igualesDia} estables`} />
          </div>

          {/* Chips de conteo */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-300 border border-rose-500/20">
              <TrendingUp className="h-3 w-3" />
              {stats.subieronDia} subieron
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/20">
              <TrendingDown className="h-3 w-3" />
              {stats.bajaronDia} bajaron
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-200/90 px-2 py-1 text-[11px] font-medium text-slate-300 border border-white/5">
              <Minus className="h-3 w-3 text-slate-500" />
              {stats.igualesDia.toLocaleString("es-AR")} estables
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Acumulado del Mes */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-surface-100 to-slate-950/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(0,102,204,0.15)] group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Inflación del Mes
            </span>
            <div className="rounded-lg bg-surface-200/80 p-2 text-slate-300 border border-white/5">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${
                isMonthPositive
                  ? "text-rose-400"
                  : stats.varMesGeneral < 0
                  ? "text-emerald-400"
                  : "text-slate-200"
              }`}
            >
              {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              en el mes en curso
            </span>
          </div>

          {/* Período de medición */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-200/70 px-3.5 py-2.5 text-xs border border-white/5">
            <span className="text-slate-400 font-medium">Período de medición</span>
            <span className="font-mono text-slate-200 font-bold">Corte 01/10 ➔ Hoy</span>
          </div>
        </div>

        {/* Tarjeta 3: Muestra de Productos Monitoreados */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-surface-100 to-slate-950/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(0,102,204,0.15)] group sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Productos Relevados
            </span>
            <div className="rounded-lg bg-surface-200/80 p-2 text-slate-300 border border-white/5">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white">
              {stats.totalMonitoreados.toLocaleString("es-AR")}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              en stock activo
            </span>
          </div>

          {/* Indicador de cobertura */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-200/70 px-3.5 py-2.5 text-xs border border-white/5">
            <span className="text-slate-400 font-medium">Cobertura</span>
            <span className="font-mono text-blue-400 font-bold">12 rubros auditados</span>
          </div>
        </div>
      </div>
    </section>
  );
}
