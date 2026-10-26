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
      <div className="lg:col-span-7 bg-white rounded-lg border border-paper-border p-5 sm:p-7 shadow-card space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-900">
            Variación por departamento
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Ponderación según el peso de cada rubro en el gasto de un hogar.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-paper-border text-ink-500 font-mono text-[11px] uppercase">
                <th className="py-2 pr-2">Rubro</th>
                <th className="py-2 px-2 text-right">Peso</th>
                <th className="py-2 px-2 text-right">Artículos</th>
                <th className="py-2 px-2 text-right">24h</th>
                <th className="py-2 pl-2 text-right">Mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border/60">
              {categorias.map((cat) => {
                const isDayUp = cat.varDia > 0;
                const isDayDown = cat.varDia < 0;
                const isMonthUp = cat.varMes > 0;
                const isMonthDown = cat.varMes < 0;

                return (
                  <tr key={cat.categoria} className="hover:bg-paper-50 transition-colors">
                    <td className="py-2.5 pr-2 font-medium text-ink-900">
                      {cat.categoria}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-ink-500 tabular-nums">
                      {Math.round(cat.peso * 100)}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-ink-500 tabular-nums">
                      {cat.totalProductos.toLocaleString("es-AR")}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      <span
                        className={
                          isDayUp
                            ? "text-carrefour-red font-semibold"
                            : isDayDown
                            ? "text-emerald-700 font-semibold"
                            : "text-ink-500"
                        }
                      >
                        {cat.varDia > 0 ? `+${cat.varDia.toFixed(2)}%` : `${cat.varDia.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-2.5 pl-2 text-right font-mono tabular-nums">
                      <span
                        className={
                          isMonthUp
                            ? "text-carrefour-red font-bold"
                            : isMonthDown
                            ? "text-emerald-700 font-bold"
                            : "text-ink-900"
                        }
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
      <div className="lg:col-span-5 bg-white rounded-lg border border-paper-border p-5 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-900">
              Movimientos del día
            </h2>
            <p className="text-xs text-ink-500">
              Artículos con mayores saltos o caídas en 24h.
            </p>
          </div>

          {/* Selector de Pestaña */}
          <div className="flex rounded border border-paper-border bg-paper-100 p-0.5 text-xs font-mono">
            <button
              onClick={() => setMoverTab("subas")}
              className={`px-2.5 py-1 rounded transition-colors ${
                moverTab === "subas"
                  ? "bg-white font-bold text-carrefour-red shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Aumentos
            </button>
            <button
              onClick={() => setMoverTab("bajas")}
              className={`px-2.5 py-1 rounded transition-colors ${
                moverTab === "bajas"
                  ? "bg-white font-bold text-emerald-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              Bajas
            </button>
          </div>
        </div>

        {/* Lista de productos con variación en $ y % */}
        <div className="divide-y divide-paper-border/70 text-xs">
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
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-paper-50 rounded px-1 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-ink-400 block truncate">
                      {prod.categoria}
                    </span>
                    <div className="font-semibold text-ink-900 truncate" title={prod.nombre}>
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
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
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
                        className="text-ink-400 hover:text-ink-900 p-1"
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
