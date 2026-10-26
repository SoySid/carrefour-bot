"use client";

import React, { useState, useMemo } from "react";
import { CategoryStat } from "@/lib/types";
import { ArrowUpDown, Flame, Clock, Layers } from "lucide-react";

interface CategoryBreakdownProps {
  categorias: CategoryStat[];
}

type SortCriteria = "peso" | "mes" | "dia" | "productos";

export function CategoryBreakdown({ categorias }: CategoryBreakdownProps) {
  const [sortKey, setSortKey] = useState<SortCriteria>("peso");

  const sortedCategories = useMemo(() => {
    return [...categorias].sort((a, b) => {
      if (sortKey === "peso") return (Number(b.peso) || 0) - (Number(a.peso) || 0);
      if (sortKey === "mes") return (Number(b.varMes) || 0) - (Number(a.varMes) || 0);
      if (sortKey === "dia") return (Number(b.varDia) || 0) - (Number(a.varDia) || 0);
      return (Number(b.totalProductos) || 0) - (Number(a.totalProductos) || 0);
    });
  }, [categorias, sortKey]);

  return (
    <section id="rubros" className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            Variación por Departamento
          </h2>
          <p className="text-xs text-slate-400">
            Seguimiento de {categorias.length} rubros ponderados según el gasto familiar.
          </p>
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-1 rounded bg-surface-100 p-0.5 border border-surface-border text-[11px] self-start sm:self-auto">
          <button
            onClick={() => setSortKey("peso")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              sortKey === "peso"
                ? "bg-surface-200 text-slate-100 border border-surface-border"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Ponderación</span>
          </button>
          <button
            onClick={() => setSortKey("mes")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              sortKey === "mes"
                ? "bg-surface-200 text-slate-100 border border-surface-border"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Suba Mes</span>
          </button>
          <button
            onClick={() => setSortKey("dia")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              sortKey === "dia"
                ? "bg-surface-200 text-slate-100 border border-surface-border"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Suba 24h</span>
          </button>
          <button
            onClick={() => setSortKey("productos")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors ${
              sortKey === "productos"
                ? "bg-surface-200 text-slate-100 border border-surface-border"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>Artículos</span>
          </button>
        </div>
      </div>

      {/* Tabla editorial de rubros */}
      <div className="overflow-hidden rounded-lg bg-surface-100 border border-surface-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-surface-200/30 border-b border-surface-border">
                <th scope="col" className="py-2.5 pl-3.5 pr-3">Departamento</th>
                <th scope="col" className="py-2.5 px-3 text-right">Artículos</th>
                <th scope="col" className="py-2.5 px-3 hidden lg:table-cell">Dispersión 24h</th>
                <th scope="col" className="py-2.5 px-3 text-right">Var. 24h</th>
                <th scope="col" className="py-2.5 pl-3 pr-3.5 text-right">Inflación Mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-xs sm:text-sm">
              {sortedCategories.map((cat) => {
                const varMes = Number(cat.varMes || 0);
                const varDia = Number(cat.varDia || 0);

                const isMonthUp = varMes > 0;
                const isMonthDown = varMes < 0;
                const isDayUp = varDia > 0;
                const isDayDown = varDia < 0;

                const totalCat = (cat.subieron || 0) + (cat.bajaron || 0) + (cat.iguales || 0) || 1;
                const barUp = Math.max(((cat.subieron || 0) / totalCat) * 100, cat.subieron > 0 ? 3 : 0);
                const barDown = Math.max(((cat.bajaron || 0) / totalCat) * 100, cat.bajaron > 0 ? 3 : 0);
                const barSame = 100 - barUp - barDown;

                return (
                  <tr
                    key={cat.categoria}
                    className="transition-colors duration-150 hover:bg-surface-200/40"
                  >
                    <td className="py-2.5 pl-3.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-100">
                          {cat.categoria}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-surface-200/80 px-1 py-0.2 rounded border border-surface-border">
                          {Math.round((cat.peso || 0) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400 text-xs">
                      {(cat.totalProductos || 0).toLocaleString("es-AR")}
                    </td>
                    <td className="py-2.5 px-3 hidden lg:table-cell">
                      <div className="w-40 space-y-1">
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
                          <div style={{ width: `${barUp}%` }} className="bg-rose-500" title={`${cat.subieron} subieron`} />
                          <div style={{ width: `${barDown}%` }} className="bg-emerald-500" title={`${cat.bajaron} bajaron`} />
                          <div style={{ width: `${barSame}%` }} className="bg-slate-700" title={`${cat.iguales} estables`} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                          <span className="text-rose-400">+{cat.subieron}</span>
                          <span className="text-emerald-400">-{cat.bajaron}</span>
                          <span>{cat.iguales} =</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs">
                      <span
                        className={
                          isDayUp
                            ? "text-rose-400 font-semibold"
                            : isDayDown
                            ? "text-emerald-400 font-semibold"
                            : "text-slate-400"
                        }
                      >
                        {varDia > 0 ? `+${varDia.toFixed(2)}%` : `${varDia.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 pr-3.5 text-right font-mono tabular-nums">
                      <span
                        className={`font-bold ${
                          isMonthUp
                            ? "text-rose-400"
                            : isMonthDown
                            ? "text-emerald-400"
                            : "text-slate-200"
                        }`}
                      >
                        {varMes > 0 ? `+${varMes.toFixed(2)}%` : `${varMes.toFixed(2)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
