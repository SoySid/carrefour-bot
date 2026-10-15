"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, X, ExternalLink, LineChart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ProductSearchResult, PricePoint } from "@/lib/types";

export function ProductSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = async (product: ProductSearchResult) => {
    setSelectedProduct(product);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/history/${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error cargando historial:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatPrecio = (valor: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <section id="buscador" className="space-y-4 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-surface-border pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Buscador de Productos
          </h2>
          <p className="text-xs text-zinc-400 sm:text-sm">
            Precios vigentes y evolución histórica por artículo individual.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, marca o categoría (ej. leche, café, fideos)..."
            className="w-full rounded-xl border border-surface-border bg-surface-100 py-3 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-3.5 text-zinc-400 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : loading ? (
            <Loader2 className="absolute right-3.5 h-4 w-4 animate-spin text-zinc-400" />
          ) : null}
        </div>

        {/* Resultados de búsqueda */}
        {results.length > 0 && (
          <div className="mt-2 divide-y divide-surface-border/50 rounded-xl border border-surface-border bg-surface-100 shadow-xl max-h-80 overflow-y-auto">
            {results.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className="flex items-center justify-between p-3 transition-colors hover:bg-surface-200 cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <span className="block text-xs font-semibold text-zinc-200 truncate">
                    {prod.nombre}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                    <span>{prod.categoria}</span>
                    <span>•</span>
                    <span className="text-zinc-500 font-mono">ID: {prod.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div>
                    <span className="block text-xs font-bold font-mono text-zinc-100">
                      {formatPrecio(prod.precioActual)}
                    </span>
                    {prod.varDia !== null ? (
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          prod.varDia > 0
                            ? "text-rose-400"
                            : prod.varDia < 0
                            ? "text-emerald-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {prod.varDia > 0 ? `+${prod.varDia.toFixed(1)}%` : `${prod.varDia.toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500">Sin datos prev.</span>
                    )}
                  </div>
                  <button
                    className="rounded-lg bg-surface-200 p-1.5 text-zinc-400 hover:text-white transition-colors"
                    title="Ver historial"
                  >
                    <LineChart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="mt-2 rounded-xl border border-surface-border bg-surface-100 p-4 text-center text-xs text-zinc-400">
            No se encontraron productos coincidentes para "{query}".
          </div>
        )}
      </div>

      {/* Modal / Ficha de Historial de Precio */}
      {selectedProduct && (
        <div className="rounded-xl border border-white/10 bg-surface-100 p-4 sm:p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-surface-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-surface-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-300 border border-white/5">
                  {selectedProduct.categoria}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  ID: {selectedProduct.id}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 mt-1">
                {selectedProduct.nombre}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {selectedProduct.url && (
                <a
                  href={selectedProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-surface-200 px-2.5 py-1 text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Ver en Carrefour</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-10 text-xs text-zinc-400 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                Cargando serie temporal...
              </div>
            ) : history.length < 2 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                Historial insuficiente para trazar la curva temporal (menos de 2 cortes registrados).
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {history.length} cortes registrados
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-zinc-400">
                      Mín: <strong className="text-emerald-400 font-bold">{formatPrecio(Math.min(...history.map(h => h.precio)))}</strong>
                    </span>
                    <span className="text-zinc-400">
                      Máx: <strong className="text-rose-400 font-bold">{formatPrecio(Math.max(...history.map(h => h.precio)))}</strong>
                    </span>
                  </div>
                </div>

                {/* Gráfico SVG SVG Line Chart nativo */}
                <div className="h-48 w-full overflow-hidden rounded-lg bg-surface-200/50 p-2 border border-white/5">
                  <PriceChart points={history} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function PriceChart({ points }: { points: PricePoint[] }) {
  if (points.length < 2) return null;

  const prices = points.map((p) => p.precio);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const width = 800;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.precio - minPrice) / range) * (height - paddingY * 2);
    return { x, y, fecha: p.fecha, precio: p.precio };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Líneas guía de fondo */}
      <line
        x1={paddingX}
        y1={paddingY}
        x2={width - paddingX}
        y2={paddingY}
        stroke="#232836"
        strokeDasharray="4 4"
      />
      <line
        x1={paddingX}
        y1={height - paddingY}
        x2={width - paddingX}
        y2={height - paddingY}
        stroke="#232836"
      />

      {/* Área y línea */}
      <path d={areaD} fill="url(#areaGradient)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Puntos destacados */}
      <circle cx={coords[0].x} cy={coords[0].y} r="3" fill="#3b82f6" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

      {/* Etiquetas de fechas */}
      <text x={paddingX} y={height - 8} fill="#71717a" fontSize="10" textAnchor="start" fontFamily="monospace">
        {points[0].fecha}
      </text>
      <text x={width - paddingX} y={height - 8} fill="#71717a" fontSize="10" textAnchor="end" fontFamily="monospace">
        {points[points.length - 1].fecha}
      </text>
    </svg>
  );
}
