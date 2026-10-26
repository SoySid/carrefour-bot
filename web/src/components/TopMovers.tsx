import React from "react";
import { ProductMover } from "@/lib/types";
import { safeExternalUrl } from "@/lib/security";
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
    <section className="space-y-3 pt-2">
      <div>
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
          Mayores Movimientos (24h)
        </h2>
        <p className="text-xs text-slate-400">
          Artículos con saltos o rebajas destacadas en góndola.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Subas */}
        <div className="rounded-lg bg-surface-100 border border-surface-border p-3.5 space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-200">
              Mayores Aumentos
            </h3>
          </div>

          <div className="space-y-1">
            {topSubas.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Sin variaciones significativas.
              </p>
            ) : (
              topSubas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded hover:bg-surface-200/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                      <span className="line-through">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-semibold text-slate-100">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="inline-flex items-center rounded bg-rose-500/10 px-1.5 py-0.2 text-[11px] font-mono font-bold text-rose-400 tabular-nums">
                      +{Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {safeExternalUrl(prod.url) && (
                      <a
                        href={safeExternalUrl(prod.url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Ver en Carrefour"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bajas */}
        <div className="rounded-lg bg-surface-100 border border-surface-border p-3.5 space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-200">
              Mayores Bajas
            </h3>
          </div>

          <div className="space-y-1">
            {topBajas.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Sin bajas registradas en este corte.
              </p>
            ) : (
              topBajas.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-2.5 py-1.5 px-2 rounded hover:bg-surface-200/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-slate-200 truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                      <span className="line-through">{formatPrecio(prod.precioAyer)}</span>
                      <span>→</span>
                      <span className="font-semibold text-emerald-400">{formatPrecio(prod.precioHoy)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.2 text-[11px] font-mono font-bold text-emerald-400 tabular-nums">
                      {Number(prod.varDia || 0).toFixed(1)}%
                    </span>
                    {safeExternalUrl(prod.url) && (
                      <a
                        href={safeExternalUrl(prod.url)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Ver en Carrefour"
                      >
                        <ExternalLink className="h-3 w-3" />
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
