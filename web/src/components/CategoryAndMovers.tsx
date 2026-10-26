"use client";

import React, { useState } from "react";
import { CategoryStat, ProductMover } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Columna Izquierda: Desglose por Departamento */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-paper-border p-5 sm:p-7 shadow-card space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-carrefour-blue font-bold block mb-1">
            Estructura de consumo
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-900">
            Variación por departamento
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Ponderación del índice según el impacto en la canasta básica familiar.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-paper-border text-ink-500 font-mono text-[11px] uppercase bg-slate-50/80">
                <th className="py-2.5 pl-3 pr-2 rounded-l">Rubro</th>
                <th className="py-2.5 px-2 text-right">Peso</th>
                <th className="py-2.5 px-2 text-right">Artículos</th>
                <th className="py-2.5 px-2 text-right">24h</th>
                <th className="py-2 pl-2 pr-3 text-right rounded-r">Mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border/60">
              {categorias.map((cat) => {
                const isDayUp = cat.varDia > 0;
                const isDayDown = cat.varDia < 0;
                const isMonthUp = cat.varMes > 0;
                const isMonthDown = cat.varMes < 0;

                return (
                  <tr key={cat.categoria} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 pl-3 pr-2 font-semibold text-ink-900">
                      {cat.categoria}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-ink-500 tabular-nums">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold">
                        {Math.round(cat.peso * 100)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-ink-500 tabular-nums">
                      {cat.totalProductos.toLocaleString("es-AR")}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      <span
                        className={
                          isDayUp
                            ? "text-carrefour-red font-bold"
                            : isDayDown
                            ? "text-emerald-700 font-bold"
                            : "text-ink-500 font-medium"
                        }
                      >
                        {cat.varDia > 0 ? `+${cat.varDia.toFixed(2)}%` : `${cat.varDia.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-2.5 pl-2 pr-3 text-right font-mono tabular-nums">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          isMonthUp
                            ? "bg-red-50 text-carrefour-red border border-red-100"
                            : isMonthDown
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "text-ink-900"
                        }`}
                      >
                        {cat.varMes > 0 ? `+${cat.varMes.toFixed(2)}%` : `${cat.varMes.toFixed(2)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Columna Derecha: Movimientos Destacados en Tabs */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-paper-border p-5 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-carrefour-blue font-bold block mb-1">
              Radar diario
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-900">
              Movimientos del día
            </h2>
            <p className="text-xs text-ink-500">
              Artículos con variaciones significativas en 24h.
            </p>
          </div>

          {/* Selector de Pestaña con Color Activo */}
          <div className="flex rounded-lg border border-paper-border bg-slate-100 p-1 text-xs font-mono">
            <button
              onClick={() => setMoverTab("subas")}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                moverTab === "subas"
                  ? "bg-white text-carrefour-red shadow-sm border border-red-100"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Aumentos
            </button>
            <button
              onClick={() => setMoverTab("bajas")}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                moverTab === "bajas"
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Bajas
            </button>
          </div>
        </div>

        {/* Lista de productos con variación en $ y % */}
        <div className="divide-y divide-paper-border/60 text-xs">
          {activeMovers.length === 0 ? (
            <div className="py-8 text-center text-ink-500 font-mono text-xs">
              No se registraron movimientos significativos en esta dirección.
            </div>
          ) : (
            activeMovers.map((prod) => {
              const diffPesos = prod.precioHoy - prod.precioAyer;
              const isPositive = diffPesos > 0;

              return (
                <div
                  key={prod.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-lg px-2 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-ink-400 font-medium block truncate">
                      {prod.categoria}
                    </span>
                    <div className="font-bold text-ink-900 truncate" title={prod.nombre}>
                      {prod.nombre}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-ink-500">
                      <span className="line-through">{formatCurrency(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-bold text-ink-900">{formatCurrency(prod.precioHoy)}</span>
                      <span
                        className={`font-semibold ${
                          isPositive ? "text-carrefour-red" : "text-emerald-700"
                        }`}
                      >
                        ({isPositive ? `+$${diffPesos}` : `-$${Math.abs(diffPesos)}`})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isPositive
                          ? "bg-red-50 text-carrefour-red border border-red-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isPositive ? `+${prod.varDia}%` : `${prod.varDia}%`}
                    </span>

                    {safeExternalUrl(prod.url) && (
                      <a
                        href={safeExternalUrl(prod.url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-400 hover:text-carrefour-blue p-1 transition-colors"
                        title="Ver en Carrefour"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
