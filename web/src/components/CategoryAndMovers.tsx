"use client";

import React, { useState } from "react";
import { CategoryStat, ProductMover } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { safeExternalUrl } from "@/lib/security";

interface CategoryAndMoversProps {
  categorias: CategoryStat[];
  topSubas: ProductMover[];
  topBajas: ProductMover[];
}

export function CategoryAndMovers({
  categorias,
  topSubas,
  topBajas,
}: CategoryAndMoversProps) {
  const [moverTab, setMoverTab] = useState<"subas" | "bajas">("subas");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const activeMovers = moverTab === "subas" ? topSubas : topBajas;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative mt-8">
      {/* Columna Izquierda: Desglose por Departamento */}
      <div className="lg:col-span-7 space-y-2">
        <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
          ESTRUCTURA DE CONSUMO — VARIACIÓN POR DEPARTAMENTO
        </div>

        <div className="paper-card sketch-frame p-5 sm:p-7 space-y-4">
          <div className="corner-ticks"></div>
          <div>
            <h2 className="font-['Oswald'] text-xl sm:text-2xl font-bold tracking-[1px] text-[#141413] uppercase">
              PONDERACIÓN POR RUBRO
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#4a4845]">
              Distribución de impacto sobre la canasta básica familiar.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-[#181715] text-[#141413] font-['Oswald'] text-xs tracking-wider uppercase bg-[#dfdad2]">
                  <th className="py-2.5 pl-3 pr-2">Rubro</th>
                  <th className="py-2.5 px-2 text-right">Peso</th>
                  <th className="py-2.5 px-2 text-right">Artículos</th>
                  <th className="py-2.5 px-2 text-right">24h</th>
                  <th className="py-2 pl-2 pr-3 text-right">Mes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7c766e]/40">
                {categorias.map((cat) => {
                  const isDayUp = cat.varDia > 0;
                  const isDayDown = cat.varDia < 0;
                  const isMonthUp = cat.varMes > 0;
                  const isMonthDown = cat.varMes < 0;

                  return (
                    <tr key={cat.categoria} className="hover:bg-black/5 transition-colors">
                      <td className="py-2.5 pl-3 pr-2 font-bold text-[#141413] font-['Oswald'] text-sm tracking-wide">
                        {cat.categoria}
                      </td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-[#141413] font-bold">
                        <span className="bg-[#dfdad2] border border-[#181715] px-1.5 py-0.5 text-[10px]">
                          {Math.round(cat.peso * 100)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-[#4a4845]">
                        {cat.totalProductos.toLocaleString("es-AR")}
                      </td>
                      <td className="py-2.5 px-2 text-right tabular-nums font-bold">
                        <span
                          className={
                            isDayUp
                              ? "text-[#a62626]"
                              : isDayDown
                              ? "text-[#1b7a43]"
                              : "text-[#55524d]"
                          }
                        >
                          {isDayUp ? `+${cat.varDia}%` : `${cat.varDia}%`}
                        </span>
                      </td>
                      <td className="py-2 pl-2 pr-3 text-right tabular-nums font-bold">
                        <span
                          className={
                            isMonthUp
                              ? "text-[#a62626]"
                              : isMonthDown
                              ? "text-[#1b7a43]"
                              : "text-[#55524d]"
                          }
                        >
                          {isMonthUp ? `+${cat.varMes}%` : `${cat.varMes}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Mayores Variaciones (Subas / Bajas) */}
      <div className="lg:col-span-5 space-y-2">
        <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
          RADAR DE MOVIMIENTOS — DISPERSIÓN 24H
        </div>

        <div className="paper-card sketch-frame p-5 sm:p-7 space-y-4">
          <div className="corner-ticks"></div>

          {/* Selector de Pestañas Subas / Bajas */}
          <div className="flex border-2 border-[#181715] bg-[#dfdad2]">
            <button
              onClick={() => setMoverTab("subas")}
              className={`flex-1 py-1.5 font-['Oswald'] text-xs uppercase font-bold tracking-wider transition-all ${
                moverTab === "subas"
                  ? "bg-[#a62626] text-[#e6dfd5] shadow-inner"
                  : "text-[#141413] hover:bg-black/5"
              }`}
            >
              MAYORES SUBAS ({topSubas.length})
            </button>
            <div className="w-[2px] bg-[#181715]" />
            <button
              onClick={() => setMoverTab("bajas")}
              className={`flex-1 py-1.5 font-['Oswald'] text-xs uppercase font-bold tracking-wider transition-all ${
                moverTab === "bajas"
                  ? "bg-[#1b7a43] text-[#e6dfd5] shadow-inner"
                  : "text-[#141413] hover:bg-black/5"
              }`}
            >
              MAYORES BAJAS ({topBajas.length})
            </button>
          </div>

          <div className="divide-y divide-[#7c766e]/40">
            {activeMovers.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#55524d]">
                No se registraron movimientos significativos en este corte.
              </div>
            ) : (
              activeMovers.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="font-['Oswald'] text-[10px] uppercase font-bold text-[#4a4845] tracking-[0.5px]">
                      {item.categoria || "GÓNDOLA"}
                    </div>
                    <div className="font-['Oswald'] font-bold text-xs sm:text-sm text-[#141413] truncate">
                      {item.nombre}
                    </div>
                    <div className="text-[11px] font-mono text-[#55524d] tabular-nums mt-0.5">
                      Antes: <span className="line-through">{formatCurrency(item.precioAyer)}</span> →{" "}
                      <span className="font-bold text-[#141413]">{formatCurrency(item.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <span
                      className={`font-mono text-sm font-extrabold px-2 py-0.5 border border-[#181715] tabular-nums ${
                        item.varDia > 0
                          ? "bg-[#f3dede] text-[#a62626]"
                          : "bg-[#def3e4] text-[#1b7a43]"
                      }`}
                    >
                      {item.varDia > 0 ? `+${item.varDia}%` : `${item.varDia}%`}
                    </span>
                    {safeExternalUrl(item.url) && (
                      <a
                        href={safeExternalUrl(item.url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#141413] opacity-60 hover:opacity-100 transition-opacity p-1"
                        title="Ver en góndola"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
