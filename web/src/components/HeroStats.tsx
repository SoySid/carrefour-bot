import React from "react";
import { ShoppingBasket } from "lucide-react";
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
    <section className="space-y-4">
      {/* Título Principal y Contexto */}
      <div className="flex flex-col gap-1 max-w-2xl">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          Índice de Precios Carrefour Online
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Relevamiento diario automatizado de stock y precios de góndola en Argentina.
        </p>
      </div>

      {/* Panel Terminal Unificado */}
      <div className="rounded-xl bg-surface-100 border border-surface-border p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Métricas Principales */}
        <div className="lg:col-span-5 flex items-baseline gap-6 border-b lg:border-b-0 lg:border-r border-surface-border pb-4 lg:pb-0 lg:pr-5">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Variación 24h
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums ${
                  isDayPositive
                    ? "text-rose-400"
                    : isDayNegative
                    ? "text-emerald-400"
                    : "text-slate-100"
                }`}
              >
                {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
              </span>
              <span className="text-[11px] text-slate-400">promedio</span>
            </div>
          </div>

          <div className="border-l border-surface-border pl-6">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Inflación mes
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums ${
                  stats.varMesGeneral > 0
                    ? "text-rose-400"
                    : stats.varMesGeneral < 0
                    ? "text-emerald-400"
                    : "text-slate-100"
                }`}
              >
                {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
              </span>
              <span className="text-[11px] text-slate-400">acumulado</span>
            </div>
          </div>
        </div>

        {/* Termómetro de Dispersión */}
        <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-surface-border pb-4 lg:pb-0 lg:pr-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Movimiento de precios</span>
            <span className="font-mono text-slate-400 tabular-nums text-[11px]">
              {stats.totalMonitoreados.toLocaleString("es-AR")} artículos
            </span>
          </div>

          <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              style={{ width: `${Math.max(pctSubieron, stats.subieronDia > 0 ? 3 : 0)}%` }}
              className="bg-rose-500 transition-all duration-300"
              title={`${stats.subieronDia} subieron`}
            />
            <div
              style={{ width: `${Math.max(pctBajaron, stats.bajaronDia > 0 ? 3 : 0)}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`${stats.bajaronDia} bajaron`}
            />
            <div
              style={{ width: `${pctCongelados}%` }}
              className="bg-slate-700 transition-all duration-300"
              title={`${stats.igualesDia} estables`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
            <span className="text-rose-400 font-medium">+{stats.subieronDia} subieron</span>
            <span className="text-emerald-400 font-medium">-{stats.bajaronDia} bajaron</span>
            <span>{stats.igualesDia.toLocaleString("es-AR")} estables</span>
          </div>
        </div>

        {/* Canasta Rápida (Changuito Compacto) */}
        <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
          <div className="text-left lg:text-right">
            <div className="flex items-center gap-1.5 lg:justify-end text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              <ShoppingBasket className="h-3.5 w-3.5 text-brand-400" />
              <span>Changuito Básico</span>
            </div>
            <div className="flex items-baseline gap-2 lg:justify-end mt-0.5">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-100 tabular-nums">
                {formatCurrency(totalChanguitoHoy)}
              </span>
              <span className={`text-[11px] font-mono font-semibold tabular-nums ${
                Number(varChanguito) > 0 ? "text-rose-400" : Number(varChanguito) < 0 ? "text-emerald-400" : "text-slate-400"
              }`}>
                {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">6 marcas líderes de referencia</span>
          </div>
        </div>
      </div>
    </section>
  );
}
