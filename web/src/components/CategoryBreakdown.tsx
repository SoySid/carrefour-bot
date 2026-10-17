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
  "Almacén": { icon: Package, color: "text-amber-400 bg-amber-500/15", badge: "Alimentos" },
  "Desayuno y merienda": { icon: Coffee, color: "text-orange-400 bg-orange-500/15", badge: "Desayuno" },
  "Bebidas": { icon: Wine, color: "text-sky-400 bg-sky-500/15", badge: "Bebidas" },
  "Lácteos y productos frescos": { icon: Milk, color: "text-blue-400 bg-blue-500/15", badge: "Lácteos" },
  "Carnes y pescados": { icon: Fish, color: "text-rose-400 bg-rose-500/15", badge: "Carnicería" },
  "Frutas y verduras": { icon: Apple, color: "text-emerald-400 bg-emerald-500/15", badge: "Verdulería" },
  "Panadería": { icon: Croissant, color: "text-amber-300 bg-amber-400/15", badge: "Panadería" },
  "Congelados": { icon: Snowflake, color: "text-cyan-400 bg-cyan-500/15", badge: "Freezer" },
  "Limpieza": { icon: Sparkles, color: "text-sky-400 bg-sky-500/15", badge: "Hogar" },
  "Perfumería y farmacia": { icon: HeartPulse, color: "text-teal-400 bg-teal-500/15", badge: "Cuidado" },
  "Mascotas": { icon: PawPrint, color: "text-emerald-300 bg-emerald-400/15", badge: "Animales" },
  "Mundo Bebé": { icon: Baby, color: "text-rose-300 bg-rose-400/15", badge: "Infantil" },
};

type SortCriteria = "mes" | "dia" | "productos";

export function CategoryBreakdown({ categorias }: CategoryBreakdownProps) {
  const [sortKey, setSortKey] = useState<SortCriteria>("mes");

  const sortedCategories = useMemo(() => {
    return [...categorias].sort((a, b) => {
      if (sortKey === "mes") return (Number(b.varMes) || 0) - (Number(a.varMes) || 0);
      if (sortKey === "dia") return (Number(b.varDia) || 0) - (Number(a.varDia) || 0);
      return (Number(b.totalProductos) || 0) - (Number(a.totalProductos) || 0);
    });
  }, [categorias, sortKey]);

  return (
    <section id="rubros" className="space-y-6 pt-6 sm:pt-8 animate-enter delay-75">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Variación por Rubro
          </h2>
          <p className="text-base text-slate-300 mt-1">
            Inflación mensual acumulada y variación en 24 horas sobre los {categorias.length} departamentos auditados.
          </p>
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-1.5 rounded-xl bg-surface-100 p-1.5 self-start sm:self-auto">
          <button
            onClick={() => setSortKey("mes")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
              sortKey === "mes"
                ? "bg-brand-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-surface-200"
            }`}
          >
            <Flame className="h-4 w-4 text-amber-300" />
            <span>Mayor en el mes</span>
          </button>
          <button
            onClick={() => setSortKey("dia")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
              sortKey === "dia"
                ? "bg-brand-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-surface-200"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Mayor en 24h</span>
          </button>
          <button
            onClick={() => setSortKey("productos")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
              sortKey === "productos"
                ? "bg-brand-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-surface-200"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Volumen</span>
          </button>
        </div>
      </div>

      {/* Tabla editorial de rubros */}
      <div className="overflow-hidden rounded-2xl bg-surface-100 animate-enter delay-150">
        <div data-ui="true" className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm font-semibold text-slate-400 bg-surface-200/50">
                <th scope="col" className="py-4 pl-6 pr-4">Rubro / Departamento</th>
                <th scope="col" className="py-4 px-4 text-right">Artículos</th>
                <th scope="col" className="py-4 px-4 hidden lg:table-cell">Comportamiento en 24h</th>
                <th scope="col" className="py-4 px-4 text-right">Var. 24h</th>
                <th scope="col" className="py-4 pl-4 pr-6 text-right">Acumulado Mes</th>
              </tr>
            </thead>
            <tbody>
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
                    className="transition-colors duration-150 odd:bg-surface-200/20 hover:bg-surface-200/60"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div>
                        <span className="block font-bold text-white text-base">
                          {cat.categoria}
                        </span>
                        <span className="text-sm font-medium text-brand-400">
                          {meta.badge}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums text-slate-300 font-medium text-sm">
                      {(cat.totalProductos || 0).toLocaleString("es-AR")}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="w-56 space-y-1.5">
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-300">
                          <div style={{ width: `${barUp}%` }} className="bg-rose-500 transition-[width] duration-300" title={`${cat.subieron} subieron`} />
                          <div style={{ width: `${barDown}%` }} className="bg-emerald-500 transition-[width] duration-300" title={`${cat.bajaron} bajaron`} />
                          <div style={{ width: `${barSame}%` }} className="bg-slate-600 transition-[width] duration-300" title={`${cat.iguales} estables`} />
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300 tabular-nums">
                          <span className="text-rose-400 font-medium">{cat.subieron} subas</span>
                          <span className="text-emerald-400 font-medium">{cat.bajaron} bajas</span>
                          <span className="text-slate-400">{cat.iguales}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums font-semibold text-sm">
                      <span
                        className={
                          isDayUp
                            ? "text-rose-400"
                            : isDayDown
                            ? "text-emerald-400"
                            : "text-slate-300"
                        }
                      >
                        {varDia > 0 ? `+${varDia.toFixed(2)}%` : `${varDia.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-4 pl-4 pr-6 text-right tabular-nums">
                      <span
                        className={`text-lg font-black tracking-tight ${
                          isMonthUp
                            ? "text-rose-400"
                            : isMonthDown
                            ? "text-emerald-400"
                            : "text-white"
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

      {/* Galería de contexto del sector de supermercados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <div className="overflow-hidden rounded-2xl bg-surface-100 aspect-[16/9] animate-enter delay-225">
          <img
            src="/assets/friendly-express-supermarket-el-socorro-main-road.jpg"
            alt="Pasillo de abarrotes y productos secos"
            className="h-full w-full object-cover"
            width={1920}
            height={1322}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="overflow-hidden rounded-2xl bg-surface-100 aspect-[16/9] animate-enter delay-300">
          <img
            src="/assets/supermarket-in-recife-pernambuco-brazil.jpg"
            alt="Sector de góndolas y bebidas"
            className="h-full w-full object-cover"
            width={1920}
            height={1160}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
