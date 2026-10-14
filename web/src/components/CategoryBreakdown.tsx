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

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  "Almacén": {
    icon: Package,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "Alimentos",
    borderHover: "hover:border-amber-500/40",
  },
  "Desayuno y merienda": {
    icon: Coffee,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    badge: "Desayuno",
    borderHover: "hover:border-orange-500/40",
  },
  "Bebidas": {
    icon: Wine,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    badge: "Bebidas",
    borderHover: "hover:border-indigo-500/40",
  },
  "Lácteos y productos frescos": {
    icon: Milk,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badge: "Lácteos",
    borderHover: "hover:border-blue-500/40",
  },
  "Carnes y pescados": {
    icon: Fish,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    badge: "Carnicería",
    borderHover: "hover:border-rose-500/40",
  },
  "Frutas y verduras": {
    icon: Apple,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badge: "Verdulería",
    borderHover: "hover:border-emerald-500/40",
  },
  "Panadería": {
    icon: Croissant,
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    badge: "Panadería",
    borderHover: "hover:border-yellow-500/40",
  },
  "Congelados": {
    icon: Snowflake,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    badge: "Freezer",
    borderHover: "hover:border-cyan-500/40",
  },
  "Limpieza": {
    icon: Sparkles,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    badge: "Hogar",
    borderHover: "hover:border-sky-500/40",
  },
  "Perfumería y farmacia": {
    icon: HeartPulse,
    color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
    badge: "Cuidado",
    borderHover: "hover:border-fuchsia-500/40",
  },
  "Mascotas": {
    icon: PawPrint,
    color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    badge: "Animales",
    borderHover: "hover:border-teal-500/40",
  },
  "Mundo Bebé": {
    icon: Baby,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    badge: "Infantil",
    borderHover: "hover:border-pink-500/40",
  },
};

type SortCriteria = "mes" | "dia" | "productos";

export function CategoryBreakdown({ categorias }: CategoryBreakdownProps) {
  const [sortKey, setSortKey] = useState<SortCriteria>("mes");

  // Ordenamiento dinámico
  const sortedCategories = useMemo(() => {
    return [...categorias].sort((a, b) => {
      if (sortKey === "mes") return (Number(b.varMes) || 0) - (Number(a.varMes) || 0);
      if (sortKey === "dia") return (Number(b.varDia) || 0) - (Number(a.varDia) || 0);
      return (Number(b.totalProductos) || 0) - (Number(a.totalProductos) || 0);
    });
  }, [categorias, sortKey]);

  return (
    <section id="categorias" className="space-y-6 pt-6 sm:pt-10">
      {/* Cabecera de la sección con selector de orden */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-surface-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/20">
              <Layers className="h-3 w-3" /> Desglose Sectorial
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {categorias.length} rubros
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Termómetro por Rubro
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Impacto inflacionario desagregado por departamento de supermercado.
          </p>
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-100 p-1 border border-surface-border self-start sm:self-auto">
          <button
            onClick={() => setSortKey("mes")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              sortKey === "mes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>Mayor Mes</span>
          </button>
          <button
            onClick={() => setSortKey("dia")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              sortKey === "dia"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Mayor Hoy</span>
          </button>
          <button
            onClick={() => setSortKey("productos")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              sortKey === "productos"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>Volumen</span>
          </button>
        </div>
      </div>

      {/* Grid moderno responsive con micro-interacciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedCategories.map((cat) => {
          const varMes = Number(cat.varMes || 0);
          const varDia = Number(cat.varDia || 0);
          const meta = CATEGORY_MAP[cat.categoria] || {
            icon: Tag,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            badge: "General",
            borderHover: "hover:border-blue-500/40",
          };
          const Icon = meta.icon;

          const isMonthHigh = varMes > 10;
          const isMonthUp = varMes > 0;
          const isMonthDown = varMes < 0;
          const isDayUp = varDia > 0;
          const isDayDown = varDia < 0;

          // Cálculo para barra de distribución
          const totalCat = (cat.subieron || 0) + (cat.bajaron || 0) + (cat.iguales || 0) || 1;
          const barUp = Math.max(((cat.subieron || 0) / totalCat) * 100, cat.subieron > 0 ? 2 : 0);
          const barDown = Math.max(((cat.bajaron || 0) / totalCat) * 100, cat.bajaron > 0 ? 2 : 0);
          const barSame = 100 - barUp - barDown;

          return (
            <div
              key={cat.categoria}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-surface-100 to-slate-950/80 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,102,204,0.12)] group ${meta.borderHover}`}
            >
              {/* Línea ambiental superior sutil */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-blue-400/30 transition-colors" />

              <div>
                {/* Cabecera de la tarjeta: Icono temático + Nombre + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border p-2 transition-transform group-hover:scale-105 ${meta.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-white transition-colors">
                        {cat.categoria}
                      </h3>
                      <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                        {meta.badge}
                      </span>
                    </div>
                  </div>

                  <span className="flex-shrink-0 rounded-md bg-surface-200/90 px-2 py-0.5 text-[11px] font-mono text-slate-400 border border-white/5">
                    {(cat.totalProductos || 0).toLocaleString("es-AR")} arts
                  </span>
                </div>

                {/* Métricas: Inflación Acumulada del Mes (Principal) */}
                <div className="mt-4 rounded-xl bg-surface-200/50 p-3 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span className="uppercase tracking-wider font-semibold">Inflación Mes</span>
                    <span className="text-slate-400">Variación 24h</span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-2xl font-black font-mono tracking-tight ${
                          isMonthHigh
                            ? "text-rose-400"
                            : isMonthUp
                            ? "text-rose-300"
                            : isMonthDown
                            ? "text-emerald-400"
                            : "text-slate-200"
                        }`}
                      >
                        {varMes > 0 ? `+${varMes.toFixed(2)}%` : `${varMes.toFixed(2)}%`}
                      </span>
                      {isMonthUp ? (
                        <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
                      ) : isMonthDown ? (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Minus className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-bold font-mono ${
                          isDayUp
                            ? "text-rose-400"
                            : isDayDown
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      >
                        {varDia > 0 ? `+${varDia.toFixed(2)}%` : `${varDia.toFixed(2)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie de tarjeta: Barra de distribución y micro-conteo */}
              <div className="mt-4 pt-3 border-t border-surface-border/40">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div style={{ width: `${barUp}%` }} className="bg-rose-500 transition-all" title={`${cat.subieron} subieron`} />
                  <div style={{ width: `${barDown}%` }} className="bg-emerald-500 transition-all" title={`${cat.bajaron} bajaron`} />
                  <div style={{ width: `${barSame}%` }} className="bg-slate-700 transition-all" title={`${cat.iguales} estables`} />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-rose-400/90 font-semibold">▲ {cat.subieron}</span>
                  <span className="text-emerald-400/90 font-semibold">▼ {cat.bajaron}</span>
                  <span className="text-slate-400 font-medium">— {cat.iguales}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
