"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { ProductSearchResult, PricePoint } from "@/lib/types";
import { safeExternalUrl } from "@/lib/security";
import { PriceSparkline } from "./PriceSparkline";
import { formatCurrency } from "@/lib/format";

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

  return (
    <div className="relative mt-8">
      {/* Pestaña superior */}
      <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
        ARCHIVO Y CONSULTA — BUSCADOR EN GÓNDOLA
      </div>

      <div className="paper-card sketch-frame p-5 sm:p-7 space-y-5">
        <div className="corner-ticks"></div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
          <div>
            <h2 className="font-['Oswald'] text-xl sm:text-2xl font-bold tracking-[1px] text-[#141413] uppercase">
              CONSULTAR ARTÍCULO O MARCA
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#4a4845] mt-0.5">
              Ingresá cualquier producto para ver su precio del día y la curva histórica.
            </p>
          </div>

          {/* Accesos rápidos con touch-target accesible */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#55524d] mr-1 font-bold">FRECUENTES:</span>
            {["Leche", "Aceite", "Yerba", "Arroz", "Fideos", "Café"].map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className="text-xs font-mono font-bold px-3 py-1.5 min-h-[34px] bg-[#dcd4c8] hover:bg-[#eadca6] border border-[#181715] text-[#141413] transition-colors active:scale-95 shadow-[1px_1px_0_rgba(0,0,0,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input de búsqueda estilo ficha técnica con anillo de foco visible */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#141413] pointer-events-none opacity-70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por artículo o marca (ej. La Serenísima, Cocinero, Matarazzo, Marolio)..."
            className="w-full border-2 border-[#181715] bg-[#dfdad2] py-2.5 pl-10 pr-11 text-sm font-mono font-medium text-[#141413] placeholder-[#6e706e] focus:bg-[#f3eee8] focus:outline-none focus:ring-2 focus:ring-[#a62626] shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setExpandedId(null);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#141413] hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
              title="Borrar texto"
              aria-label="Borrar texto de búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          ) : loading ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-[#141413]" />
            </div>
          ) : null}
        </div>

        {/* Estado Vacío Explícito cuando no hay resultados */}
        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="p-4 border-2 border-dashed border-[#7c766e] bg-[#dfdad2]/50 text-center font-mono text-xs text-[#4a4845] space-y-1.5">
            <div className="font-bold text-[#141413] uppercase tracking-wide">
              Sin coincidencias para «{query}»
            </div>
            <div>
              Verificá la ortografía o intentá con palabras más genéricas (ej. «leche», «fideos», «aceite»).
            </div>
          </div>
        )}

        {/* Listado de resultados */}
        {results.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-dashed border-[#7c766e]">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#4a4845]">
              <span>{results.length} ARTÍCULOS ENCONTRADOS</span>
              <span className="text-[#a62626]">TOCÁ UN ARTÍCULO PARA VER SU SERIE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              {results.map((prod) => {
                const isExpanded = expandedId === prod.id;
                const prodHistory = history[prod.id] || [];
                const isLoadingThis = loadingHistory === prod.id;

                return (
                  <div
                    key={prod.id}
                    className={`border-2 border-[#181715] transition-all ${
                      isExpanded
                        ? "bg-[#f3eee8] shadow-[3px_3px_0_#181715]"
                        : "bg-[#e8e2d9] hover:bg-[#efe9df]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => handleToggleExpand(prod)}
                      className="w-full text-left p-3 cursor-pointer flex items-center justify-between gap-3 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
                    >
                      {prod.imagenUrl ? (
                        <div className="h-11 w-11 rounded border border-[#181715] bg-white p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.imagenUrl}
                            alt={prod.nombre}
                            width={44}
                            height={44}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="font-['Oswald'] text-[10px] uppercase font-bold tracking-[0.5px] text-[#4a4845]">
                          {prod.categoria || "GÓNDOLA"}
                        </div>
                        <div className="font-['Oswald'] font-bold text-xs sm:text-sm text-[#141413] truncate" title={prod.nombre}>
                          {prod.nombre}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 font-mono">
                        <div className="font-black text-sm text-[#141413] tabular-nums">
                          {formatCurrency(prod.precioActual)}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {prod.varDia !== null ? (
                            <span
                              className={`text-[10px] font-bold ${
                                prod.varDia > 0
                                  ? "text-[#a62626]"
                                  : prod.varDia < 0
                                  ? "text-[#1b7a43]"
                                  : "text-[#55524d]"
                              }`}
                            >
                              {prod.varDia > 0 ? `+${prod.varDia}%` : `${prod.varDia}%`}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#55524d]">0.0%</span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 text-[#141413]" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-[#141413]" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Evolución desplegable */}
                    {isExpanded && (
                      <div className="p-3 border-t border-dashed border-[#7c766e] bg-[#dfdad2]/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-[#141413]">EVOLUCIÓN EN GÓNDOLA:</span>
                          {safeExternalUrl(prod.url) && (
                            <a
                              href={safeExternalUrl(prod.url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#a62626] hover:underline flex items-center gap-1 text-[11px] min-h-[30px] items-center"
                            >
                              <span>VER EN CARREFOUR</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {isLoadingThis ? (
                          <div className="flex items-center justify-center py-4 text-xs font-mono text-[#141413] gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Cargando serie histórica...</span>
                          </div>
                        ) : prodHistory.length > 0 ? (
                          <PriceSparkline data={prodHistory} height={60} />
                        ) : (
                          <div className="text-center py-2 text-xs font-mono text-[#55524d]">
                            Sin registros históricos anteriores.
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
      </div>
    </div>
  );
}
