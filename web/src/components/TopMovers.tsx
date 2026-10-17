import React from "react";
import { ProductMover } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

interface TopMoversProps {
  topSubas: ProductMover[];
  topBajas: ProductMover[];
}

export function TopMovers({ topSubas, topBajas }: TopMoversProps) {
  const formatPrecio = (valor: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <section id="movimientos" className="space-y-6 pt-6 sm:pt-8 animate-enter delay-75">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Mayores variaciones del día
        </h2>
        <p className="text-base text-slate-300">
          Artículos con mayores fluctuaciones de precio registradas en las últimas 24 horas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Columna 1: Mayores Aumentos */}
        <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-7 space-y-4 animate-enter delay-150">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mayores subas en 24h
              </h3>
              <span className="text-sm text-slate-400">Productos con mayor variación positiva</span>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            {topSubas.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No se registraron aumentos significativos en este corte.
              </p>
            ) : (
              topSubas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-surface-200/60 transition-colors duration-150"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1 tabular-nums">
                      <span className="text-slate-400">{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-400">{formatPrecio(prod.precioAyer)}</span>
                      <span>a</span>
                      <span className="font-bold text-white">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-rose-500/15 border border-rose-500/20 px-2.5 py-1 text-sm font-bold text-rose-400 tabular-nums">
                      +{Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-surface-200 p-2 text-slate-300 hover:text-white hover:bg-surface-300 transition-colors"
                        title="Ver en Carrefour"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna 2: Mayores Bajas */}
        <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-7 space-y-4 animate-enter delay-225">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mayores bajas en 24h
              </h3>
              <span className="text-sm text-slate-400">Productos con mayor reducción de precio</span>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            {topBajas.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No se registraron bajas de precio en este corte.
              </p>
            ) : (
              topBajas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-surface-200/60 transition-colors duration-150"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1 tabular-nums">
                      <span className="text-slate-400">{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-400">{formatPrecio(prod.precioAyer)}</span>
                      <span>a</span>
                      <span className="font-bold text-emerald-400">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-sm font-bold text-emerald-400 tabular-nums">
                      {Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-surface-200 p-2 text-slate-300 hover:text-white hover:bg-surface-300 transition-colors"
                        title="Ver en Carrefour"
                      >
                        <ExternalLink className="h-4 w-4" />
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
