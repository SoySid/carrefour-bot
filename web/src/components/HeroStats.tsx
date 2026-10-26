"use client";

import React, { useState } from "react";
import { DailyStats, ChanguitoItem, PricePoint } from "@/lib/types";
import { ShoppingBag, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, Loader2, ExternalLink } from "lucide-react";
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
      <div className="lg:col-span-7 bg-white rounded-lg border border-paper-border p-5 sm:p-7 shadow-card space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-500 block mb-1">
            Índice Ponderado de Consumo
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 leading-snug">
            Variación de precios en góndola
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Medición diaria calculada sobre {stats.totalMonitoreados.toLocaleString("es-AR")} artículos disponibles en Carrefour online.
          </p>
        </div>

        {/* Dos grandes métricas tipo periódico económico */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-b border-paper-border py-5">
          <div>
            <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wide">
              Variación 24h
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight ${
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
            <span className="text-[11px] text-ink-500 block mt-1">
              Respecto al corte de ayer
            </span>
          </div>

          <div className="border-l border-paper-border pl-4 sm:pl-6">
            <div className="text-[11px] font-mono text-ink-500 uppercase tracking-wide">
              Acumulado del mes
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight ${
                  stats.varMesGeneral > 0
                    ? "text-carrefour-red"
                    : stats.varMesGeneral < 0
                    ? "text-emerald-700"
                    : "text-ink-900"
                }`}
              >
                {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
              </span>
            </div>
            <span className="text-[11px] text-ink-500 block mt-1">
              Desde el 1 del mes en curso
            </span>
          </div>
        </div>

        {/* Barra de dispersión */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-ink-700 font-medium">Comportamiento del catálogo hoy</span>
            <span className="text-ink-500 text-[11px] tabular-nums">
              {stats.conVarDia.toLocaleString("es-AR")} artículos comparables
            </span>
          </div>

          <div className="h-3 w-full bg-paper-200 rounded overflow-hidden flex">
            <div
              style={{ width: `${Math.max(pctSubieron, stats.subieronDia > 0 ? 2 : 0)}%` }}
              className="bg-carrefour-red transition-all"
              title={`${stats.subieronDia} subieron`}
            />
            <div
              style={{ width: `${Math.max(pctBajaron, stats.bajaronDia > 0 ? 2 : 0)}%` }}
              className="bg-emerald-600 transition-all"
              title={`${stats.bajaronDia} bajaron`}
            />
            <div
              style={{ width: `${pctEstables}%` }}
              className="bg-paper-border transition-all"
              title={`${stats.igualesDia} sin cambios`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-ink-700 pt-0.5">
            <span className="text-carrefour-red font-semibold">
              +{stats.subieronDia} subieron ({pctSubieron.toFixed(1)}%)
            </span>
            <span className="text-emerald-700 font-semibold">
              -{stats.bajaronDia} bajaron ({pctBajaron.toFixed(1)}%)
            </span>
            <span className="text-ink-500">
              {stats.igualesDia} estables ({pctEstables.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: El Ticket del Changuito de Marcas Líderes */}
      <div className="lg:col-span-5 bg-paper-50 rounded-lg border-2 border-dashed border-paper-border p-5 sm:p-6 shadow-ticket space-y-4 relative">
        {/* Cabecera del ticket */}
        <div className="text-center border-b border-paper-border pb-3">
          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-700 font-bold">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Ticket Changuito Básico</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-0.5">
            Canasta de 6 artículos de primeras marcas de consumo diario
          </p>
        </div>

        {/* Lista de productos del ticket */}
        <div className="divide-y divide-paper-border/70 text-xs">
          {changuito.map((it) => {
            const isSelected = selectedItem?.id === it.id;
            return (
              <div
                key={it.id}
                onClick={() => handleSelectChanguitoItem(it)}
                className={`py-2 px-1 flex items-center justify-between gap-3 cursor-pointer rounded transition-colors ${
                  isSelected ? "bg-white shadow-sm ring-1 ring-paper-border" : "hover:bg-white/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-ink-400">
                      {it.categoria}
                    </span>
                    {it.varDia !== 0 && (
                      <span
                        className={`text-[10px] font-mono font-semibold px-1 rounded ${
                          it.varDia > 0
                            ? "bg-red-100 text-carrefour-red"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {it.varDia > 0 ? `+${it.varDia}%` : `${it.varDia}%`}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-ink-900 truncate mt-0.5" title={it.nombre}>
                    {it.nombre}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <div className="font-bold text-ink-900 tabular-nums">
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

        {/* Panel desplegable de evolución al tocar un producto del ticket */}
        {selectedItem && (
          <div className="border border-paper-border rounded bg-white p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink-900 truncate pr-2">
                Curva: {selectedItem.nombre}
              </span>
              {safeExternalUrl(selectedItem.url) && (
                <a
                  href={safeExternalUrl(selectedItem.url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-carrefour-blue hover:underline flex items-center gap-1 text-[11px] font-mono flex-shrink-0"
                >
                  <span>Góndola</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-4 text-xs text-ink-500 gap-1.5 font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-carrefour-blue" />
                <span>Cargando serie...</span>
              </div>
            ) : (
              <PriceSparkline data={history} height={48} />
            )}
          </div>
        )}

        {/* Total del ticket */}
        <div className="border-t-2 border-dashed border-paper-border pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink-500 block">
              Total Changuito
            </span>
            <span className="text-[11px] text-ink-500">Suma de los 6 productos</span>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono text-ink-900 tabular-nums">
              {formatCurrency(totalChanguitoHoy)}
            </div>
            <div
              className={`text-xs font-mono font-semibold tabular-nums ${
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
