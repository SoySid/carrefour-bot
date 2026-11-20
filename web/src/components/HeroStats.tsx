"use client";

import React, { useState } from "react";
import { DailyStats, ChanguitoItem, PricePoint } from "@/lib/types";
import { Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
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

        {/* COLUMNA DERECHA: TICKET RECIBO TÉRMICO */}
        <div className="relative filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.8)]">
          <div className="ticket-clipped px-5 sm:px-6 pt-7 pb-8 text-[#1c1b19] font-mono">
            {/* Encabezado estilo impresora térmica */}
            <div className="text-center space-y-0.5 pb-2.5">
              <div className="text-[10px] tracking-[0.22em] text-[#55524d] uppercase">
                *** COMPROBANTE DE GÓNDOLA ***
              </div>
              <div className="font-bold text-sm tracking-[0.14em] text-[#141413] uppercase">
                CHANGUITO BÁSICO
              </div>
              <div className="text-[10px] text-[#4a4845] uppercase tracking-[0.06em]">
                {changuito.length} PRIMERAS MARCAS • CORTE {stats.fechaHoy}
              </div>
            </div>

            <div className="border-t border-dashed border-[#6e6a63] my-2" />

            {/* Cabecera de columnas */}
            <div className="flex justify-between text-[10px] font-bold tracking-[0.08em] text-[#4a4845] uppercase px-1.5 pb-1">
              <span>CANT / ARTÍCULO</span>
              <span>IMPORTE</span>
            </div>

            <div className="border-t border-dashed border-[#6e6a63]/70 mb-1.5" />

            {/* Listado dinámico de ítems del Ticket */}
            <div className="space-y-1">
              {changuito.map((it) => {
                const isSelected = selectedItemId === it.id;
                const itHistory = historyCache[it.id] || [];
                const isLoadingThis = loadingHistoryId === it.id;

                return (
                  <div key={it.id} className="border-b border-dotted border-[#8c877e]/45 last:border-b-0 pb-1">
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      onClick={() => handleSelectChanguitoItem(it)}
                      className={`w-full text-left px-1.5 py-1.5 rounded-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
                        isSelected ? "bg-black/10" : "hover:bg-black/5"
                      }`}
                    >
                      <div className="flex justify-between items-baseline gap-2 text-[11px] sm:text-xs font-bold text-[#181715] uppercase leading-snug">
                        <span className="truncate group-hover:underline" title={it.nombre}>
                          1x {it.nombre}
                        </span>
                        <span className="tabular-nums whitespace-nowrap font-extrabold tracking-tight">
                          {formatCurrency(it.precioHoy)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#4a4845] mt-0.5 tabular-nums">
                        <div className="flex items-center gap-1.5 uppercase">
                          <span className="opacity-75">{it.categoria || "ALMACÉN"}</span>
                          <span>•</span>
                          {it.varDia !== 0 ? (
                            <span className={`font-bold ${it.varDia > 0 ? "text-[#a62626]" : "text-[#1b7a43]"}`}>
                              {it.varDia > 0 ? `+${it.varDia.toFixed(2)}%` : `${it.varDia.toFixed(2)}%`}
                            </span>
                          ) : (
                            <span>0.00%</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {it.precioAyer > 0 && it.precioAyer !== it.precioHoy && (
                            <span className="line-through opacity-60">
                              {formatCurrency(it.precioAyer)}
                            </span>
                          )}
                          <span className="text-[#141413] opacity-55 group-hover:opacity-100">
                            {isSelected ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Despliegue inline del historial */}
                    {isSelected && (
                      <div className="my-1.5 mx-1 p-2.5 bg-[#e6e0d4] border border-[#1c1b19]/70 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold truncate pr-2 text-[#141413] text-[10px] uppercase">
                            HISTORIAL: {it.nombre}
                          </span>
                          {safeExternalUrl(it.url) && (
                            <a
                              href={safeExternalUrl(it.url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#a62626] hover:underline flex items-center gap-1 font-bold text-[10px] flex-shrink-0 uppercase"
                            >
                              <span>Góndola</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {isLoadingThis ? (
                          <div className="flex items-center justify-center py-3 text-[#141413] gap-1.5 text-xs">
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
            <div className="mt-3 pt-2.5 border-t-2 border-double border-[#2b2927]">
              <div className="flex items-baseline justify-between text-sm sm:text-base font-extrabold tracking-tight text-[#111] tabular-nums">
                <span>TOTAL</span>
                <span>{formatCurrency(totalChanguitoHoy)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#4a4845] uppercase mt-1 tabular-nums">
                <span>VAR. 24H CANASTA</span>
                <span className={Number(varChanguito) > 0 ? "text-[#a62626]" : Number(varChanguito) < 0 ? "text-[#1b7a43]" : ""}>
                  {Number(varChanguito) > 0 ? `+${varChanguito}%` : `${varChanguito}%`}
                </span>
              </div>
            </div>

            {/* Pie con código de barras térmico */}
            <div className="mt-4 pt-3 border-t border-dashed border-[#6e6a63] flex flex-col items-center gap-1.5">
              <svg
                viewBox="0 0 220 34"
                className="w-48 h-8 text-[#1c1b19] opacity-85"
                aria-hidden="true"
              >
                <g fill="currentColor">
                  <rect x="4" y="0" width="2" height="34" />
                  <rect x="8" y="0" width="1" height="34" />
                  <rect x="12" y="0" width="3" height="34" />
                  <rect x="18" y="0" width="1" height="34" />
                  <rect x="21" y="0" width="2" height="34" />
                  <rect x="26" y="0" width="4" height="34" />
                  <rect x="33" y="0" width="1" height="34" />
                  <rect x="36" y="0" width="2" height="34" />
                  <rect x="41" y="0" width="1" height="34" />
                  <rect x="44" y="0" width="3" height="34" />
                  <rect x="50" y="0" width="2" height="34" />
                  <rect x="55" y="0" width="1" height="34" />
                  <rect x="59" y="0" width="4" height="34" />
                  <rect x="66" y="0" width="2" height="34" />
                  <rect x="70" y="0" width="1" height="34" />
                  <rect x="74" y="0" width="3" height="34" />
                  <rect x="80" y="0" width="1" height="34" />
                  <rect x="83" y="0" width="2" height="34" />
                  <rect x="88" y="0" width="3" height="34" />
                  <rect x="94" y="0" width="1" height="34" />
                  <rect x="98" y="0" width="2" height="34" />
                  <rect x="103" y="0" width="4" height="34" />
                  <rect x="110" y="0" width="1" height="34" />
                  <rect x="113" y="0" width="2" height="34" />
                  <rect x="118" y="0" width="3" height="34" />
                  <rect x="124" y="0" width="1" height="34" />
                  <rect x="128" y="0" width="2" height="34" />
                  <rect x="133" y="0" width="4" height="34" />
                  <rect x="140" y="0" width="1" height="34" />
                  <rect x="144" y="0" width="3" height="34" />
                  <rect x="150" y="0" width="2" height="34" />
                  <rect x="155" y="0" width="1" height="34" />
                  <rect x="158" y="0" width="2" height="34" />
                  <rect x="163" y="0" width="4" height="34" />
                  <rect x="170" y="0" width="1" height="34" />
                  <rect x="174" y="0" width="2" height="34" />
                  <rect x="179" y="0" width="3" height="34" />
                  <rect x="185" y="0" width="1" height="34" />
                  <rect x="189" y="0" width="2" height="34" />
                  <rect x="194" y="0" width="3" height="34" />
                  <rect x="200" y="0" width="1" height="34" />
                  <rect x="204" y="0" width="2" height="34" />
                  <rect x="209" y="0" width="3" height="34" />
                  <rect x="214" y="0" width="2" height="34" />
                </g>
              </svg>
              <div className="text-[9px] tracking-[0.26em] text-[#55524d] tabular-nums">
                779089500{changuito.length.toString().padStart(2, "0")}42
              </div>
              <div className="text-[9px] tracking-[0.14em] text-[#55524d] uppercase">
                NO VÁLIDO COMO FACTURA • TOCÁ UN ÍTEM PARA VER CURVA
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
