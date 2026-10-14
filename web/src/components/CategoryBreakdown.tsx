import React from "react";
import { CategoryStat } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, Tag } from "lucide-react";

interface CategoryBreakdownProps {
  categorias: CategoryStat[];
}

export function CategoryBreakdown({ categorias }: CategoryBreakdownProps) {
  return (
    <section id="categorias" className="space-y-4 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            Variación por Categoría
          </h2>
          <p className="text-xs text-slate-400 sm:text-sm">
            Evolución de precios desagregada por rubro de supermercado.
          </p>
        </div>
        <span className="hidden text-xs text-slate-500 sm:inline">
          {categorias.length} rubros monitoreados
        </span>
      </div>

      {/* Grid en desktop, carrusel horizontal con snap en móvil */}
      <div className="flex gap-4 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
        {categorias.map((cat) => {
          const varMes = Number(cat.varMes || 0);
          const varDia = Number(cat.varDia || 0);
          const isMonthUp = varMes > 0;
          const isMonthDown = varMes < 0;
          const isDayUp = varDia > 0;
          const isDayDown = varDia < 0;

          return (
            <div
              key={cat.categoria}
              className="min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-start flex-shrink-0 rounded-xl border border-surface-border bg-surface-100 p-4 transition-all hover:border-slate-600/80"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-surface-200 p-1.5 text-brand-500">
                    <Tag className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 line-clamp-1">
                    {cat.categoria}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {cat.totalProductos || 0} arts.
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-surface-200/60 p-2.5">
                <div>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Mes
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isMonthUp ? (
                      <TrendingUp className="h-3 w-3 text-rose-400" />
                    ) : isMonthDown ? (
                      <TrendingDown className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Minus className="h-3 w-3 text-slate-400" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        isMonthUp
                          ? "text-rose-400"
                          : isMonthDown
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }`}
                    >
                      {varMes > 0 ? `+${varMes.toFixed(2)}%` : `${varMes.toFixed(2)}%`}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Día
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isDayUp ? (
                      <TrendingUp className="h-3 w-3 text-rose-400" />
                    ) : isDayDown ? (
                      <TrendingDown className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Minus className="h-3 w-3 text-slate-400" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        isDayUp
                          ? "text-rose-400"
                          : isDayDown
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }`}
                    >
                      {varDia > 0 ? `+${varDia.toFixed(2)}%` : `${varDia.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="text-rose-400/90 font-medium">▲ {cat.subieron}</span>
                <span className="text-emerald-400/90 font-medium">▼ {cat.bajaron}</span>
                <span className="text-slate-500 font-medium">— {cat.iguales}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
