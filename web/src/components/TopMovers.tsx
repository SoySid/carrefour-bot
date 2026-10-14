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
    <section id="movimientos" className="space-y-4 pt-4 sm:pt-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
          Movimientos Clave del Día
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Los mayores incrementos y descuentos reales detectados en el último escaneo diario.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Columna 1: Mayores Aumentos */}
        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-surface-border/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Mayores Aumentos
            </h3>
          </div>

          <div className="mt-3 divide-y divide-surface-border/40">
            {topSubas.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No se registraron aumentos significativos en este corte.
              </p>
            ) : (
              topSubas.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-500">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-medium text-slate-200">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-rose-500/15 px-2 py-1 text-xs font-bold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                      +{Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-slate-400 hover:bg-surface-200 hover:text-slate-200 transition-colors"
                        title="Ver en Carrefour"
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

        {/* Columna 2: Mayores Bajas */}
        <div className="rounded-xl border border-surface-border bg-surface-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-surface-border/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Mayores Bajas y Ofertas
            </h3>
          </div>

          <div className="mt-3 divide-y divide-surface-border/40">
            {topBajas.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                No se registraron bajas de precio en este corte.
              </p>
            ) : (
              topBajas.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-500">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-medium text-emerald-400">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      {Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-slate-400 hover:bg-surface-200 hover:text-slate-200 transition-colors"
                        title="Ver en Carrefour"
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
