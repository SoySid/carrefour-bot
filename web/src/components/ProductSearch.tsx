"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { ProductSearchResult, PricePoint } from "@/lib/types";
import { safeExternalUrl } from "@/lib/security";
import { PriceSparkline } from "./PriceSparkline";

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

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <section className="bg-white rounded-lg border border-paper-border p-5 sm:p-7 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-900">
            Consultar producto o marca
          </h2>
          <p className="text-xs sm:text-sm text-ink-500">
            Ingresá el nombre de cualquier artículo para ver su precio de hoy y la curva histórica.
          </p>
        </div>

        {/* Accesos rápidos */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-ink-400 mr-1">Comunes:</span>
          {["Leche", "Aceite", "Yerba", "Arroz", "Fideos", "Café"].map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="text-xs font-mono rounded bg-paper-100 hover:bg-paper-200 border border-paper-border px-2 py-0.5 text-ink-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input de búsqueda tipo comando */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por artículo o marca (ej. La Serenísima, Cocinero, Matarazzo, Marolio)..."
          className="w-full rounded border border-paper-border bg-paper-50 py-3 pl-10 pr-10 text-sm text-ink-900 placeholder-ink-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-carrefour-blue focus:border-carrefour-blue transition-colors"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setExpandedId(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700"
            title="Borrar texto"
          >
            <X className="h-4 w-4" />
          </button>
        ) : loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
          </div>
        ) : null}
      </div>

      {/* Listado de resultados */}
      {results.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-paper-border">
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>{results.length} coincidencias encontradas</span>
            <span>Tocá un artículo para ver su gráfico</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((prod) => {
              const isExpanded = expandedId === prod.id;
              const prodHistory = history[prod.id] || [];
              const isLoadingThis = loadingHistory === prod.id;

              return (
                <div
                  key={prod.id}
                  className={`rounded border transition-all ${
                    isExpanded
                      ? "bg-paper-50 border-carrefour-blue ring-1 ring-carrefour-blue/30"
                      : "bg-white border-paper-border hover:border-ink-400"
                  }`}
                >
                  <div
                    onClick={() => handleToggleExpand(prod)}
                    className="p-3 cursor-pointer flex items-center justify-between gap-3 select-none"
                  >
                    {/* Imagen de producto si existe */}
                    {prod.imagenUrl ? (
                      <div className="h-12 w-12 rounded bg-white border border-paper-border/60 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.imagenUrl}
                          alt={prod.nombre}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded bg-paper-200/50 border border-paper-border flex-shrink-0 flex items-center justify-center text-[10px] font-mono text-ink-400 uppercase">
                        S/F
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-ink-400 truncate">
                          {prod.categoria}
                        </span>
                        {prod.varDia !== null && prod.varDia !== undefined && prod.varDia !== 0 && (
                          <span
                            className={`text-[10px] font-mono font-semibold px-1 rounded ${
                              prod.varDia > 0
                                ? "bg-red-100 text-carrefour-red"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {prod.varDia > 0 ? `+${prod.varDia}%` : `${prod.varDia}%`}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-ink-900 truncate mt-0.5" title={prod.nombre}>
                        {prod.nombre}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                      <div className="text-right">
                        <span className="text-sm font-bold text-ink-900 tabular-nums">
                          {formatCurrency(prod.precioActual)}
                        </span>
                      </div>
                      <div className="text-ink-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Panel expandido con gráfico de curva */}
                  {isExpanded && (
                    <div className="border-t border-paper-border bg-white p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-ink-500">Historial de precios</span>
                        {safeExternalUrl(prod.url) && (
                          <a
                            href={safeExternalUrl(prod.url)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-carrefour-blue hover:underline text-xs font-mono"
                          >
                            <span>Ficha en Carrefour</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {isLoadingThis ? (
                        <div className="flex items-center justify-center py-4 text-xs font-mono text-ink-500 gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-carrefour-blue" />
                          <span>Consultando base de precios...</span>
                        </div>
                      ) : (
                        <PriceSparkline data={prodHistory} />
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
