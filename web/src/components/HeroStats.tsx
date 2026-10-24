import React from "react";
import { ShoppingBasket, Activity, ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <section className="space-y-6">
      {/* Título Principal */}
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400">
          <Activity className="h-3.5 w-3.5" />
          <span>Monitor de góndola en tiempo real</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 text-balance">
          Precios al consumidor en Carrefour
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl text-balance">
          Relevamiento diario e independiente calculado sobre artículos con stock activo en la tienda online.
        </p>
      </div>

      {/* Franja Horizontal: Indicadores Macro y Dispersión (Ancho Completo) */}
      <div className="rounded-xl bg-surface-100 border border-surface-border p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Métricas de Inflación (4 columnas) */}
        <div className="lg:col-span-4 flex items-baseline gap-4 sm:gap-6 border-b lg:border-b-0 lg:border-r border-surface-border pb-4 lg:pb-0 lg:pr-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Variación 24h
            </span>
            <span
              className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums block mt-1 ${
                isDayPositive
                  ? "text-rose-400"
                  : isDayNegative
                  ? "text-emerald-400"
                  : "text-slate-100"
              }`}
            >
              {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
            </span>
            <span className="text-xs text-slate-400 font-medium block mt-0.5">
              Promedio ponderado
            </span>
          </div>

          <div className="border-l border-surface-border/60 pl-4 sm:pl-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Acumulado mes
            </span>
            <span
              className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums block mt-1 ${
                stats.varMesGeneral > 0
                  ? "text-rose-400"
                  : stats.varMesGeneral < 0
                  ? "text-emerald-400"
                  : "text-slate-100"
              }`}
            >
              {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
            </span>
            <span className="text-xs text-slate-400 font-medium block mt-0.5">
              Desde el 1 del mes
            </span>
          </div>
        </div>

        {/* Termómetro de Dispersión (5 columnas) */}
        <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-surface-border pb-4 lg:pb-0 lg:pr-6">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Dispersión de precios hoy</span>
            <span className="font-mono text-slate-400 tabular-nums text-[11px]">
              {stats.totalMonitoreados.toLocaleString("es-AR")} artículos relevados
            </span>
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-200">
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

          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 font-mono text-xs tabular-nums">
            <span className="text-rose-400 font-medium">+{stats.subieronDia} subas ({pctSubieron.toFixed(1)}%)</span>
            <span className="text-emerald-400 font-medium">-{stats.bajaronDia} bajas ({pctBajaron.toFixed(1)}%)</span>
            <span className="text-slate-300 font-medium">{stats.igualesDia.toLocaleString("es-AR")} estables ({pctCongelados.toFixed(1)}%)</span>
          </div>
        </div>

        {/* Cobertura de góndola (3 columnas) */}
        <div className="lg:col-span-3 flex lg:flex-col justify-between lg:justify-center items-center lg:items-start gap-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Corte matutino
          </span>
          <span className="text-sm font-semibold text-slate-200">
            100% stock verificado
          </span>
          <span className="text-xs text-slate-400">
            10 departamentos esenciales
          </span>
        </div>
      </div>

      {/* Bloque Destacado: Canasta Básica de Primeras Marcas */}
      <div className="rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShoppingBasket className="h-4 w-4 text-brand-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Canasta Básica de Primeras Marcas
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Seguimiento de marcas líderes de consumo masivo (La Serenísima, Natura, Matarazzo, Gallo Oro, Pureza y Taragüí).
            </p>
          </div>

          <div className="flex items-baseline gap-4 self-start sm:self-auto bg-surface-200/50 px-4 py-2 rounded-lg border border-surface-border">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Changuito</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
                {formatCurrency(totalChanguitoHoy)}
              </span>
            </div>
            <div className="text-right border-l border-surface-border/60 pl-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Var. 24h</span>
              <span className={`text-xs font-mono font-bold tabular-nums ${
                Number(varChanguito) > 0 ? "text-rose-400" : Number(varChanguito) < 0 ? "text-emerald-400" : "text-slate-300"
              }`}>
                {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Grilla limpia de los 6 productos de marca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {changuito.map((prod) => (
            <div
              key={prod.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-200/30 border border-surface-border/60 hover:bg-surface-200/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wide block">
                  {prod.categoria}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-200 truncate mt-0.5" title={prod.nombre}>
                  {prod.nombre}
                </h3>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-mono text-sm sm:text-base font-extrabold text-slate-100 tabular-nums block">
                  {formatCurrency(prod.precioHoy)}
                </span>
                {prod.varDia !== 0 && (
                  <span className={`text-[10px] font-mono font-bold ${
                    prod.varDia > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {prod.varDia > 0 ? `+${prod.varDia}%` : `${prod.varDia}%`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
