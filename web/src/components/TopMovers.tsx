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
    <section className="space-y-4 pt-4 sm:pt-6">
      <div className="flex flex-col gap-1 max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          Mayores Movimientos en Góndola (24h)
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Artículos con saltos de precio o rebajas destacadas en el último corte de stock.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Columna 1: Mayores Aumentos */}
        <div className="rounded-xl bg-surface-100 border border-surface-border p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-surface-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Mayores Aumentos Registrados
              </h3>
              <span className="text-[11px] text-slate-400">Variación porcentual positiva en 24h</span>
            </div>
          </div>

          <div className="space-y-1">
            {topSubas.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No se registraron aumentos significativos en este corte.
              </p>
            ) : (
              topSubas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-surface-200/50 transition-colors duration-150"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs sm:text-sm font-semibold text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                      <span className="text-slate-400 text-[11px] font-sans">{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-400">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-bold text-slate-100">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 text-xs font-mono font-bold text-rose-400 tabular-nums">
                      +{Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-200 transition-colors"
                        title="Verificar en Carrefour"
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
        <div className="rounded-xl bg-surface-100 border border-surface-border p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-surface-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Mayores Bajas y Descuentos
              </h3>
              <span className="text-[11px] text-slate-400">Variación porcentual negativa en 24h</span>
            </div>
          </div>

          <div className="space-y-1">
            {topBajas.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No se registraron bajas de precio en este corte.
              </p>
            ) : (
              topBajas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-surface-200/50 transition-colors duration-150"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs sm:text-sm font-semibold text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                      <span className="text-slate-400 text-[11px] font-sans">{prod.categoria}</span>
                      <span>•</span>
                      <span className="line-through text-slate-400">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-bold text-emerald-400">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {prod.url && (
                      <a
                        href={prod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-200 transition-colors"
                        title="Verificar en Carrefour"
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
