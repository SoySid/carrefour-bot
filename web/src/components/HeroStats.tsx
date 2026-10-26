"use client";

import React, { useState } from "react";
import { DailyStats, ChanguitoItem, PricePoint } from "@/lib/types";
import { ShoppingBag, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { PriceSparkline } from "./PriceSparkline";
import { safeExternalUrl } from "@/lib/security";

interface HeroStatsProps {
  stats: DailyStats;
  changuito?: ChanguitoItem[];
}

export function HeroStats({ stats, changuito = [] }: HeroStatsProps) {
  const [selectedItem, setSelectedItem] = useState<ChanguitoItem | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const totalMovs = (stats.subieronDia || 0) + (stats.bajaronDia || 0) + (stats.igualesDia || 0) || 1;
  const pctSubieron = ((stats.subieronDia || 0) / totalMovs) * 100;
  const pctBajaron = ((stats.bajaronDia || 0) / totalMovs) * 100;
  const pctEstables = ((stats.igualesDia || 0) / totalMovs) * 100;

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

  const handleSelectChanguitoItem = async (it: ChanguitoItem) => {
    if (selectedItem?.id === it.id) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(it);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/history/${it.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error al cargar historial del changuito:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Columna Izquierda: Gran Índice Editorial */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-paper-border p-5 sm:p-7 shadow-card space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-bold text-carrefour-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mb-2">
            <span>Índice Ponderado de Consumo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900 leading-snug">
            Variación de precios en góndola
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Calculado diariamente sobre {stats.totalMonitoreados.toLocaleString("es-AR")} artículos relevados en tiempo real.
          </p>
        </div>

        {/* Dos grandes métricas tipo tarjeta coloreada */}
        <div className="grid grid-cols-2 gap-4">
          {/* Variación 24h Card */}
          <div className="rounded-xl bg-gradient-to-br from-red-50/70 to-red-50/20 border border-red-100 p-4 sm:p-5">
            <span className="text-[11px] font-mono font-semibold text-red-800 uppercase tracking-wide block">
              Variación 24h
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight ${
                  stats.varDiaGeneral > 0
                    ? "text-carrefour-red"
                    : stats.varDiaGeneral < 0
                    ? "text-emerald-700"
                    : "text-ink-900"
                }`}
              >
                {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
              </span>
            </div>
            <span className="text-[11px] text-red-700/80 font-medium block mt-1">
              Respecto al corte anterior
            </span>
          </div>

          {/* Variación Mes Card */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 border border-blue-100 p-4 sm:p-5">
            <span className="text-[11px] font-mono font-semibold text-blue-800 uppercase tracking-wide block">
              Acumulado del mes
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight ${
                  stats.varMesGeneral > 0
                    ? "text-carrefour-blue"
                    : stats.varMesGeneral < 0
                    ? "text-emerald-700"
                    : "text-ink-900"
                }`}
              >
                {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
              </span>
            </div>
            <span className="text-[11px] text-blue-700/80 font-medium block mt-1">
              Inflación mes corriente
            </span>
          </div>
        </div>

        {/* Barra de dispersión */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-ink-700 font-semibold">Comportamiento del catálogo</span>
            <span className="text-ink-500 text-[11px] tabular-nums font-medium">
              {stats.conVarDia.toLocaleString("es-AR")} artículos comparables
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-paper-border/60">
            <div
              style={{ width: `${Math.max(pctSubieron, stats.subieronDia > 0 ? 3 : 0)}%` }}
              className="bg-carrefour-red transition-all"
              title={`${stats.subieronDia} subieron`}
            />
            <div
              style={{ width: `${Math.max(pctBajaron, stats.bajaronDia > 0 ? 3 : 0)}%` }}
              className="bg-emerald-500 transition-all"
              title={`${stats.bajaronDia} bajaron`}
            />
            <div
              style={{ width: `${pctEstables}%` }}
              className="bg-slate-300 transition-all"
              title={`${stats.igualesDia} sin cambios`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums pt-0.5">
            <span className="text-carrefour-red font-bold inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-carrefour-red" />
              +{stats.subieronDia} subieron ({pctSubieron.toFixed(1)}%)
            </span>
            <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              -{stats.bajaronDia} bajaron ({pctBajaron.toFixed(1)}%)
            </span>
            <span className="text-slate-500 font-medium">
              {stats.igualesDia} estables ({pctEstables.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: El Ticket del Changuito con borde de acento */}
      <div className="lg:col-span-5 bg-gradient-to-b from-white to-amber-50/20 rounded-xl border border-amber-200/80 p-5 sm:p-6 shadow-ticket space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-carrefour-blue to-carrefour-red" />

        {/* Cabecera del ticket */}
        <div className="text-center border-b border-paper-border pb-3">
          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-900 font-extrabold bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
            <ShoppingBag className="h-3.5 w-3.5 text-amber-800" />
            <span>Ticket Changuito Básico</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-1">
            6 artículos indispensables de primeras marcas
          </p>
        </div>

        {/* Lista de productos del ticket */}
        <div className="divide-y divide-paper-border/60 text-xs">
          {changuito.map((it) => {
            const isSelected = selectedItem?.id === it.id;
            return (
              <div
                key={it.id}
                onClick={() => handleSelectChanguitoItem(it)}
                className={`py-2 px-2 flex items-center justify-between gap-3 cursor-pointer rounded-lg transition-all ${
                  isSelected
                    ? "bg-blue-50/70 border border-blue-200 shadow-sm"
                    : "hover:bg-amber-50/50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-ink-400 font-medium">
                      {it.categoria}
                    </span>
                    {it.varDia !== 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          it.varDia > 0
                            ? "bg-red-100 text-carrefour-red"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {it.varDia > 0 ? `+${it.varDia}%` : `${it.varDia}%`}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-ink-900 truncate mt-0.5" title={it.nombre}>
                    {it.nombre}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <div className="font-extrabold text-ink-900 tabular-nums">
                    {formatCurrency(it.precioHoy)}
                  </div>
                  {it.precioAyer > 0 && it.precioAyer !== it.precioHoy && (
                    <div className="text-[10px] text-ink-400 line-through tabular-nums">
                      {formatCurrency(it.precioAyer)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel desplegable de evolución */}
        {selectedItem && (
          <div className="border border-blue-200 rounded-lg bg-white p-3.5 space-y-2 text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-900 truncate pr-2 text-xs">
                Curva: {selectedItem.nombre}
              </span>
              {safeExternalUrl(selectedItem.url) && (
                <a
                  href={safeExternalUrl(selectedItem.url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-carrefour-blue hover:underline flex items-center gap-1 text-[11px] font-mono font-semibold flex-shrink-0"
                >
                  <span>Góndola</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-4 text-xs text-ink-500 gap-1.5 font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-carrefour-blue" />
                <span>Cargando serie histórica...</span>
              </div>
            ) : (
              <PriceSparkline data={history} height={48} />
            )}
          </div>
        )}

        {/* Total del ticket */}
        <div className="border-t-2 border-dashed border-paper-border pt-3.5 flex items-baseline justify-between bg-white/50 p-2.5 rounded-lg border border-paper-border/60">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500 font-bold block">
              Total Changuito
            </span>
            <span className="text-[11px] text-ink-500">6 primeras marcas</span>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black font-mono text-ink-900 tabular-nums">
              {formatCurrency(totalChanguitoHoy)}
            </div>
            <div
              className={`text-xs font-mono font-bold tabular-nums ${
                Number(varChanguito) > 0
                  ? "text-carrefour-red"
                  : Number(varChanguito) < 0
                  ? "text-emerald-700"
                  : "text-ink-500"
              }`}
            >
              {Number(varChanguito) > 0 ? `+${varChanguito}% vs ayer` : `${varChanguito}% vs ayer`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
