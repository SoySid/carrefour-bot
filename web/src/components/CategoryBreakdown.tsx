"use client";

import React, { useState, useMemo } from "react";
import { CategoryStat } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Milk,
  HeartPulse,
  Croissant,
  Package,
  Snowflake,
  Coffee,
  Fish,
  Apple,
  Wine,
  PawPrint,
  Baby,
  Tag,
  ArrowUpDown,
  Flame,
  Clock,
  Layers,
} from "lucide-react";

interface CategoryBreakdownProps {
  categorias: CategoryStat[];
}

interface CategoryMeta {
  icon: React.ElementType;
  color: string;
  badge: string;
  borderHover: string;
}

const CATEGORY_MAP: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
  "Carnes y pescados": { icon: Fish, color: "text-rose-400 bg-rose-500/15", badge: "Carnicería" },
  "Almacén": { icon: Package, color: "text-amber-400 bg-amber-500/15", badge: "Alimentos" },
  "Lácteos y productos frescos": { icon: Milk, color: "text-blue-400 bg-blue-500/15", badge: "Lácteos" },
  "Frutas y verduras": { icon: Apple, color: "text-emerald-400 bg-emerald-500/15", badge: "Verdulería" },
  "Panadería": { icon: Croissant, color: "text-amber-300 bg-amber-400/15", badge: "Panadería" },
  "Desayuno y merienda": { icon: Coffee, color: "text-orange-400 bg-orange-500/15", badge: "Desayuno" },
  "Bebidas": { icon: Wine, color: "text-sky-400 bg-sky-500/15", badge: "Bebidas" },
  "Limpieza": { icon: Sparkles, color: "text-sky-400 bg-sky-500/15", badge: "Hogar" },
  "Perfumería y farmacia": { icon: HeartPulse, color: "text-teal-400 bg-teal-500/15", badge: "Higiene" },
  "Congelados": { icon: Snowflake, color: "text-cyan-400 bg-cyan-500/15", badge: "Freezer" },
};

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
    <section id="rubros" className="space-y-4 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Variación Ponderada por Departamento
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Estructura de consumo auditando {categorias.length} categorías esenciales de góndola.
          </p>
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-1 rounded-lg bg-surface-100 p-1 self-start sm:self-auto border border-surface-border text-xs">
          <button
            onClick={() => setSortKey("peso")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors duration-150 ${
              sortKey === "peso"
                ? "bg-brand-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Ponderación</span>
          </button>
          <button
            onClick={() => setSortKey("mes")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors duration-150 ${
              sortKey === "mes"
                ? "bg-brand-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-200"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Suba Mes</span>
          </button>
          <button
            onClick={() => setSortKey("dia")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors duration-150 ${
              sortKey === "dia"
                ? "bg-brand-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-200"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Suba 24h</span>
          </button>
          <button
            onClick={() => setSortKey("productos")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors duration-150 ${
              sortKey === "productos"
                ? "bg-brand-500 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-200"
            }`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Artículos</span>
          </button>
        </div>
      </div>

      {/* Tabla editorial de rubros */}
      <div className="overflow-hidden rounded-xl bg-surface-100 border border-surface-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-slate-400 bg-surface-200/40 border-b border-surface-border">
                <th scope="col" className="py-3 pl-4 pr-3">Departamento</th>
                <th scope="col" className="py-3 px-3 text-right">Artículos</th>
                <th scope="col" className="py-3 px-3 hidden lg:table-cell">Dispersión 24h</th>
                <th scope="col" className="py-3 px-3 text-right">Var. 24h</th>
                <th scope="col" className="py-3 pl-3 pr-4 text-right">Acumulado Mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {sortedCategories.map((cat) => {
                const varMes = Number(cat.varMes || 0);
                const varDia = Number(cat.varDia || 0);
                const meta = CATEGORY_MAP[cat.categoria] || {
                  icon: Tag,
                  color: "text-blue-400 bg-blue-500/15",
                  badge: "General",
                };

                const isMonthUp = varMes > 0;
                const isMonthDown = varMes < 0;
                const isDayUp = varDia > 0;
                const isDayDown = varDia < 0;

                const totalCat = (cat.subieron || 0) + (cat.bajaron || 0) + (cat.iguales || 0) || 1;
                const barUp = Math.max(((cat.subieron || 0) / totalCat) * 100, cat.subieron > 0 ? 2 : 0);
                const barDown = Math.max(((cat.bajaron || 0) / totalCat) * 100, cat.bajaron > 0 ? 2 : 0);
                const barSame = 100 - barUp - barDown;

                return (
                  <tr
                    key={cat.categoria}
                    className="transition-colors duration-150 hover:bg-surface-200/50"
                  >
                    <td className="py-3 pl-4 pr-3">
                      <div>
                        <span className="block font-semibold text-slate-100 text-xs sm:text-sm">
                          {cat.categoria}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-brand-400">
                            {meta.badge}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-surface-200 px-1.5 py-0.2 rounded border border-surface-border">
                            Peso: {Math.round((cat.peso || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300 text-xs sm:text-sm">
                      {(cat.totalProductos || 0).toLocaleString("es-AR")}
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <div className="w-48 space-y-1">
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
                          <div style={{ width: `${barUp}%` }} className="bg-rose-500 transition-all duration-300" title={`${cat.subieron} subieron`} />
                          <div style={{ width: `${barDown}%` }} className="bg-emerald-500 transition-all duration-300" title={`${cat.bajaron} bajaron`} />
                          <div style={{ width: `${barSame}%` }} className="bg-slate-700 transition-all duration-300" title={`${cat.iguales} estables`} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                          <span className="text-rose-400 font-semibold">{cat.subieron} subas</span>
                          <span className="text-emerald-400 font-semibold">{cat.bajaron} bajas</span>
                          <span>{cat.iguales} sin cambio</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-xs sm:text-sm">
                      <span
                        className={
                          isDayUp
                            ? "text-rose-400 font-bold"
                            : isDayDown
                            ? "text-emerald-400 font-bold"
                            : "text-slate-400"
                        }
                      >
                        {varDia > 0 ? `+${varDia.toFixed(2)}%` : `${varDia.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right font-mono tabular-nums">
                      <span
                        className={`text-sm sm:text-base font-bold tracking-tight ${
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
