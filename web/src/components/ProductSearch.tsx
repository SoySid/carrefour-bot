"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { ProductSearchResult, PricePoint } from "@/lib/types";
import { safeExternalUrl } from "@/lib/security";

export function ProductSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, PricePoint[]>>({});
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Error buscando productos:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleToggleExpand = async (product: ProductSearchResult) => {
    if (expandedId === product.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(product.id);

    if (!history[product.id]) {
      setLoadingHistory(product.id);
      try {
        const res = await fetch(`/api/history/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setHistory((prev) => ({ ...prev, [product.id]: data }));
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoadingHistory(null);
      }
    }
  };

  const formatPrecio = (valor: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const quickSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <section className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
            Consultar Producto
          </h2>
          <p className="text-xs text-slate-400">
            Buscá por artículo o marca para consultar precio y evolución en góndola.
          </p>
        </div>

        {/* Chips de búsqueda rápida */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Frecuentes:</span>
          {["Leche", "Aceite", "Yerba", "Arroz", "Fideos"].map((chip) => (
            <button
              key={chip}
              onClick={() => quickSearch(chip)}
              className="text-[11px] rounded bg-surface-100 hover:bg-surface-200 border border-surface-border px-2 py-0.5 text-slate-300 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por artículo o marca (ej. La Serenísima, Cocinero, Marolio)..."
            className="w-full rounded-lg bg-surface-100 border border-surface-border py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setExpandedId(null);
              }}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          ) : loading ? (
            <div className="absolute right-3">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {results.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
            <span>{results.length} coincidencias</span>
            <span>Clic para ver evolución de precios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {results.map((prod) => {
              const isExpanded = expandedId === prod.id;
              const prodHistory = history[prod.id] || [];
              const isLoadingThis = loadingHistory === prod.id;

              return (
                <div
                  key={prod.id}
                  className={`rounded-lg border transition-colors duration-150 overflow-hidden ${
                    isExpanded
                      ? "bg-surface-100 border-brand-500/50"
                      : "bg-surface-100 border-surface-border hover:border-surface-300"
                  }`}
                >
                  <div
                    onClick={() => handleToggleExpand(prod)}
                    className="p-3 cursor-pointer flex items-center justify-between gap-3 select-none"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                          {prod.categoria}
                        </span>
                        {prod.varDia !== null && prod.varDia !== undefined && prod.varDia !== 0 && (
                          <span
                            className={`inline-flex items-center text-[10px] font-mono font-semibold px-1 py-0.2 rounded ${
                              prod.varDia > 0
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {prod.varDia > 0 ? `+${prod.varDia}%` : `${prod.varDia}%`}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-200 truncate mt-0.5" title={prod.nombre}>
                        {prod.nombre}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-100 tabular-nums">
                          {formatPrecio(prod.precioActual)}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Panel expandible con Historial Inline */}
                  {isExpanded && (
                    <div className="border-t border-surface-border bg-surface-50/70 p-3 space-y-2.5">
                      {isLoadingThis ? (
                        <div className="flex items-center justify-center py-4 text-xs text-slate-400 gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-400" />
                          <span>Cargando evolución de precios...</span>
                        </div>
                      ) : prodHistory.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2 text-center">
                          Sin historial reciente disponible.
                        </p>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                            <span className="text-[11px] font-medium text-slate-300">Historial reciente</span>
                            {safeExternalUrl(prod.url) && (
                              <a
                                href={safeExternalUrl(prod.url)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-[11px]"
                              >
                                <span>Ver en Carrefour</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs no-scrollbar">
                            {prodHistory.slice(-6).map((pt, idx) => (
                              <div
                                key={idx}
                                className="flex-1 min-w-[65px] rounded bg-surface-200/50 p-1.5 border border-surface-border text-center"
                              >
                                <span className="block text-[10px] text-slate-400">
                                  {pt.fecha.split("-").slice(1).reverse().join("/")}
                                </span>
                                <span className="font-semibold text-slate-200 tabular-nums block mt-0.5 text-xs">
                                  {formatPrecio(pt.precio)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
