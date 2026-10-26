"use client";

import React, { useState } from "react";
import { DailyStats, ChanguitoItem, PricePoint } from "@/lib/types";
import { ShoppingBag, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { PriceSparkline } from "./PriceSparkline";
import { safeExternalUrl } from "@/lib/security";
import { formatCurrency } from "@/lib/format";

interface HeroStatsProps {
  stats: DailyStats;
  changuito?: ChanguitoItem[];
}

export function HeroStats({ stats, changuito = [] }: HeroStatsProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [historyCache, setHistoryCache] = useState<Record<string, PricePoint[]>>({});
  const [loadingHistoryId, setLoadingHistoryId] = useState<string | null>(null);

  const subieron = stats.subieronDia || 0;
  const bajaron = stats.bajaronDia || 0;
  const estables = stats.igualesDia || 0;
  const totalMovs = subieron + bajaron + estables || 1;

  const pctSubieron = (subieron / totalMovs) * 100;
  const pctBajaron = (bajaron / totalMovs) * 100;
  const pctEstables = (estables / totalMovs) * 100;

  const totalChanguitoHoy = changuito.reduce((acc, it) => acc + (it.precioHoy || 0), 0);
  const totalChanguitoAyer = changuito.reduce((acc, it) => acc + (it.precioAyer || 0), 0);
  const varChanguito =
    totalChanguitoAyer > 0
      ? (((totalChanguitoHoy - totalChanguitoAyer) / totalChanguitoAyer) * 100).toFixed(1)
      : "0.0";

  const handleSelectChanguitoItem = async (it: ChanguitoItem) => {
    if (selectedItemId === it.id) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(it.id);

    if (!historyCache[it.id]) {
      setLoadingHistoryId(it.id);
      try {
        const res = await fetch(`/api/history/${it.id}`);
        if (res.ok) {
          const data = await res.json();
          setHistoryCache((prev) => ({ ...prev, [it.id]: data }));
        }
      } catch (err) {
        console.error("Error al cargar historial del changuito:", err);
      } finally {
        setLoadingHistoryId(null);
      }
    }
  };

  return (
    <div className="relative text-[#e6dfd5] font-mono">
      {/* Título de Sección Principal */}
      <div className="mb-6">
        <h1 className="font-['Oswald'] text-3xl sm:text-5xl lg:text-[3.2rem] font-bold tracking-[2px] leading-[1.05] text-[#e6dfd5] uppercase drop-shadow-[2px_3px_0px_rgba(0,0,0,0.85)]">
          VARIACIÓN DE PRECIOS EN GÓNDOLA
        </h1>
      </div>

      {/* Grid de Contenido Principal */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.52fr_1fr] gap-8 lg:gap-10 items-start relative">
        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-7">
          {/* Bloque Resumen - Índice Ponderado de Consumo */}
          <div className="relative mt-2">
            <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
              RESUMEN — ÍNDICE PONDERADO DE CONSUMO
            </div>

            <div className="paper-card sketch-frame p-4 sm:p-6 z-0">
              <div className="corner-ticks"></div>
              <div className="font-['Oswald'] text-lg sm:text-[1.38rem] font-semibold tracking-[1px] text-[#141413] uppercase mb-3.5">
                COMPORTAMIENTO DEL CATÁLOGO • {stats.totalMonitoreados.toLocaleString("es-AR")} ARTÍCULOS COMPARABLES
              </div>

              {/* Barra segmentada funcional con proporciones reales */}
              <div
                className="w-full h-[29px] border-2 border-[#252422] rounded-2xl bg-[#dfdad2] relative overflow-hidden flex items-center mb-3.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]"
                role="img"
                aria-label={`Distribución de precios: ${subieron} subieron, ${bajaron} bajaron, ${estables} estables`}
              >
                <div className="flex-1 h-full flex rounded-xl overflow-hidden">
                  <div
                    style={{ width: `${Math.max(pctSubieron, subieron > 0 ? 3 : 0)}%` }}
                    className="bg-[#a62626] h-full transition-all duration-300"
                    title={`${subieron} subieron (${pctSubieron.toFixed(1)}%)`}
                  />
                  <div
                    style={{ width: `${Math.max(pctBajaron, bajaron > 0 ? 3 : 0)}%` }}
                    className="bg-[#1b7a43] h-full transition-all duration-300"
                    title={`${bajaron} bajaron (${pctBajaron.toFixed(1)}%)`}
                  />
                  <div
                    style={{ width: `${pctEstables}%` }}
                    className="bg-[#6e706e] h-full transition-all duration-300 opacity-90"
                    title={`${estables} estables (${pctEstables.toFixed(1)}%)`}
                  />
                </div>
              </div>

              {/* Leyenda de estadísticas */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between text-xs sm:text-[0.93rem] font-bold text-[#141413] pt-0.5 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a62626] inline-block flex-shrink-0" />
                  <span>{subieron} SUBIERON ({pctSubieron.toFixed(1)}%)</span>
                </div>
                <div className="hidden sm:block w-[1.5px] h-5 bg-[#55524d]" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1b7a43] inline-block flex-shrink-0" />
                  <span>{bajaron} BAJARON ({pctBajaron.toFixed(1)}%)</span>
                </div>
                <div className="hidden sm:block w-[1.5px] h-5 bg-[#55524d]" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6e706e] inline-block flex-shrink-0" />
                  <span>{estables} ESTABLES ({pctEstables.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fila de 2 tarjetas inferiores (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 relative">
            {/* Tarjeta Variación 24H */}
            <div className="paper-card sketch-frame p-4 sm:p-5 min-h-[160px] flex flex-col justify-start relative">
              <div className="corner-ticks"></div>
              <div className="font-['Oswald'] text-lg sm:text-[1.32rem] font-medium tracking-[0.8px] text-[#141413] mb-2 sm:mb-3 flex items-center gap-2.5 uppercase">
                <span>VARIACIÓN 24H</span>
                <span className="w-6 h-[2px] bg-[#141413] inline-block" />
              </div>
              <div
                className={`font-mono text-4xl sm:text-5xl font-extrabold tracking-[-2px] leading-none mt-1 ${
                  stats.varDiaGeneral > 0
                    ? "text-[#a62626]"
                    : stats.varDiaGeneral < 0
                    ? "text-[#1b7a43]"
                    : "text-[#141413]"
                }`}
              >
                {stats.varDiaGeneral > 0 ? `+${stats.varDiaGeneral.toFixed(2)}%` : `${stats.varDiaGeneral.toFixed(2)}%`}
              </div>
              <div className="text-[11px] font-mono text-[#55524d] mt-2">
                Respecto al corte anterior
              </div>
              <div className="absolute bottom-1 right-1.5 w-7 h-7 border-r-2 border-b-2 border-[#222] -skew-x-12 opacity-60 pointer-events-none" />
            </div>

            {/* Tarjeta Acumulado del Mes */}
            <div className="paper-card sketch-frame p-4 sm:p-5 min-h-[160px] flex flex-col justify-start relative">
              <div className="corner-ticks"></div>
              <div className="font-['Oswald'] text-lg sm:text-[1.32rem] font-medium tracking-[0.8px] text-[#141413] mb-2 sm:mb-3 flex items-center gap-2.5 uppercase">
                <span>ACUMULADO DEL MES</span>
                <span className="w-6 h-[2px] bg-[#141413] inline-block" />
              </div>
              <div
                className={`font-mono text-4xl sm:text-5xl font-extrabold tracking-[-2px] leading-none mt-1 ${
                  stats.varMesGeneral > 0
                    ? "text-[#a62626]"
                    : stats.varMesGeneral < 0
                    ? "text-[#1b7a43]"
                    : "text-[#141413]"
                }`}
              >
                {stats.varMesGeneral > 0 ? `+${stats.varMesGeneral.toFixed(2)}%` : `${stats.varMesGeneral.toFixed(2)}%`}
              </div>
              <div className="text-[11px] font-mono text-[#55524d] mt-2">
                Inflación mes corriente
              </div>
              <div className="absolute bottom-1 right-1.5 w-7 h-7 border-r-2 border-b-2 border-[#222] -skew-x-12 opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: TICKET RECIBO */}
        <div className="relative filter drop-shadow-[8px_12px_18px_rgba(0,0,0,0.85)]">
          <div className="ticket-clipped p-5 sm:p-6 text-[#141413] space-y-2">
            <div className="text-center font-['Oswald'] text-xs font-bold tracking-[1.5px] text-[#2b2927]">
              TICKET
            </div>

            <div className="flex justify-center mb-2">
              <div className="bg-[#eadca6] border-[1.5px] border-[#4a4538] rounded-md px-3 py-0.5 inline-flex items-center gap-1.5 font-['Oswald'] text-sm font-bold tracking-[0.8px] text-[#141413] shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>CHANGUITO BÁSICO</span>
              </div>
            </div>

            <div className="text-center font-['Oswald'] text-xs font-semibold tracking-[0.6px] text-[#2c2a28] leading-tight uppercase">
              {changuito.length} ARTÍCULOS INDISPENSABLES DE PRIMERAS MARCAS<br />
              — TOTAL {formatCurrency(totalChanguitoHoy)}
            </div>

            <div className="border-b-[1.5px] border-dashed border-[#7c766e] my-2" />

            {/* Listado dinámico de ítems del Ticket con despliegue inline y botón accesible */}
            <div className="space-y-1.5">
              {changuito.map((it) => {
                const isSelected = selectedItemId === it.id;
                const itHistory = historyCache[it.id] || [];
                const isLoadingThis = loadingHistoryId === it.id;

                return (
                  <div key={it.id} className="border-b border-[#7c766e]/20 last:border-b-0 pb-1">
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      onClick={() => handleSelectChanguitoItem(it)}
                      className={`w-full text-left p-1.5 rounded transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
                        isSelected ? "bg-black/10 ring-1 ring-[#141413]" : "hover:bg-black/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-['Oswald'] text-[11px] font-bold text-[#3a3734] tracking-[0.5px] uppercase">
                          {it.categoria || "ALMACÉN"} —
                        </div>
                        <span className="text-[#141413] opacity-60 group-hover:opacity-100">
                          {isSelected ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-['Oswald'] font-bold text-xs sm:text-[13px] tracking-[0.4px] text-[#161514]">
                        <span className="truncate pr-2 group-hover:underline" title={it.nombre}>
                          {it.nombre}
                        </span>
                        <span className="font-mono font-extrabold text-xs whitespace-nowrap">
                          {formatCurrency(it.precioHoy)}
                        </span>
                      </div>
                      <div className="flex items-baseline font-mono text-[11px] font-bold text-[#2c2a28] mt-0.5">
                        {it.varDia !== 0 ? (
                          <span className={it.varDia > 0 ? "text-[#a62626]" : "text-[#1b7a43]"}>
                            {it.varDia > 0 ? `+${it.varDia}%` : `${it.varDia}%`}
                          </span>
                        ) : (
                          <span>VAR 0.0%</span>
                        )}
                        <span className="flex-1 border-b-[1.5px] border-dotted border-[#5c5750] mx-1.5 relative -top-[3px]" />
                        {it.precioAyer > 0 && it.precioAyer !== it.precioHoy && (
                          <span className="line-through opacity-60 text-[10px]">
                            {formatCurrency(it.precioAyer)}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Despliegue inline del historial */}
                    {isSelected && (
                      <div className="my-1.5 p-2.5 bg-[#dfdad2]/80 border border-[#141413] rounded text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold truncate pr-2 text-[#141413] text-[11px]">
                            Curva: {it.nombre}
                          </span>
                          {safeExternalUrl(it.url) && (
                            <a
                              href={safeExternalUrl(it.url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#a62626] hover:underline flex items-center gap-1 font-mono font-bold text-[10px] flex-shrink-0"
                            >
                              <span>Góndola</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {isLoadingThis ? (
                          <div className="flex items-center justify-center py-3 text-[#141413] gap-1.5 font-mono text-xs">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Cargando serie...</span>
                          </div>
                        ) : (
                          <PriceSparkline data={itHistory} height={44} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total del Ticket */}
            <div className="mt-3 pt-2 border-t-[1.5px] border-dashed border-[#7c766e]">
              <div className="flex items-baseline justify-between font-['Oswald'] text-sm sm:text-base font-bold tracking-[0.6px] text-[#111] mb-1">
                <span>TOTAL CHANGUITO</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-[#5c5750] mx-2 relative -top-[3px]" />
                <span className="font-mono font-extrabold text-sm sm:text-base">
                  {formatCurrency(totalChanguitoHoy)}
                </span>
              </div>
              <div className="text-[11px] font-bold tracking-[0.5px] text-[#2b2927] uppercase">
                {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`} VS AYER • {changuito.length} PRIMERAS MARCAS
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
