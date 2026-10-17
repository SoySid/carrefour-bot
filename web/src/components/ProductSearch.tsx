"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, X, ExternalLink, LineChart, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
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
    <section id="buscador" className="space-y-6 pt-6 sm:pt-8 animate-enter delay-75">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Buscador de Productos
        </h2>
        <p className="text-base text-slate-300">
          Consultá precios vigentes y evolución histórica por artículo individual en tiempo real.
        </p>
      </div>

      <div className="relative animate-enter delay-150">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por producto, marca o rubro (ej. leche, café, fideos)..."
            className="w-full rounded-2xl bg-surface-100 py-4 pl-12 pr-12 text-base text-white placeholder-slate-400 focus:bg-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors duration-200"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-4 text-slate-400 hover:text-white transition-colors p-1"
              title="Borrar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          ) : loading ? (
            <Loader2 className="absolute right-4 h-5 w-5 animate-spin text-brand-400" />
          ) : null}
        </div>

        {/* Resultados de búsqueda */}
        {results.length > 0 && (
          <div className="mt-2.5 rounded-2xl bg-surface-100 p-2 max-h-80 overflow-y-auto space-y-1 z-30 relative animate-fade-in">
            {results.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className="flex items-center justify-between p-3.5 rounded-xl transition-colors duration-150 hover:bg-surface-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                  {prod.imagenUrl && (
                    <img
                      src={prod.imagenUrl}
                      alt=""
                      className="h-10 w-10 flex-shrink-0 rounded-lg bg-white object-contain p-1"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white truncate">
                      {prod.nombre}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                      <span>{prod.categoria}</span>
                      <span>•</span>
                      <span className="text-slate-400 tabular-nums">Código: {prod.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 flex-shrink-0 text-right">
                  <div>
                    <span className="block text-sm font-bold text-white tabular-nums">
                      {formatPrecio(prod.precioActual)}
                    </span>
                    {prod.varDia !== null ? (
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          prod.varDia > 0
                            ? "text-rose-400"
                            : prod.varDia < 0
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      >
                        {prod.varDia > 0 ? `+${prod.varDia.toFixed(1)}%` : `${prod.varDia.toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">Sin cambio</span>
                    )}
                  </div>
                  <div
                    className="rounded-lg bg-surface-200 p-2 text-slate-300 transition-colors group-hover:text-white"
                    title="Ver historial"
                  >
                    <LineChart className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="mt-2.5 rounded-2xl bg-surface-100 p-5 text-center text-sm text-slate-300">
            No se encontraron productos coincidentes para "{query}".
          </div>
        )}
      </div>

      {/* Modal / Ficha de Historial de Precio */}
      {selectedProduct && (
        <div className="rounded-2xl bg-surface-100 p-6 sm:p-7 space-y-5 animate-fade-in-up" data-ui="true">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {selectedProduct.imagenUrl && (
                <a
                  href={selectedProduct.imagenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  title="Abrir o descargar imagen oficial"
                  className="group flex-shrink-0"
                >
                  <img
                    src={selectedProduct.imagenUrl}
                    alt={selectedProduct.nombre}
                    className="h-16 w-16 rounded-xl bg-white object-contain p-1.5 transition-transform group-hover:scale-105"
                  />
                </a>
              )}
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-surface-200 px-2.5 py-1 text-sm font-medium text-slate-200">
                    {selectedProduct.categoria}
                  </span>
                  <span className="text-sm text-slate-400 tabular-nums">
                    Código: {selectedProduct.id}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                  {selectedProduct.nombre}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedProduct.imagenUrl && (
                <a
                  href={selectedProduct.imagenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 rounded-lg bg-surface-200 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-white hover:bg-surface-300"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar imagen</span>
                </a>
              )}
              {selectedProduct.url && (
                <a
                  href={selectedProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:bg-brand-600 active:scale-95"
                >
                  <span>Ver en Carrefour</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg bg-surface-200 p-2 text-slate-400 hover:text-white transition-colors"
                title="Cerrar detalle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12 text-sm text-slate-300 gap-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
                <span>Cargando serie temporal...</span>
              </div>
            ) : history.length < 2 ? (
              <div className="py-10 text-center text-sm text-slate-300">
                Historial insuficiente para trazar la curva temporal (menos de 2 cortes registrados).
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 tabular-nums">
                    {history.length} cortes registrados
                  </span>
                  <div className="flex items-center gap-4 text-sm tabular-nums">
                    <span className="text-slate-300">
                      Mínimo: <strong className="text-emerald-400 font-bold">{formatPrecio(Math.min(...history.map(h => h.precio)))}</strong>
                    </span>
                    <span className="text-slate-300">
                      Máximo: <strong className="text-rose-400 font-bold">{formatPrecio(Math.max(...history.map(h => h.precio)))}</strong>
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full max-w-full overflow-hidden rounded-xl bg-surface-200 p-3">
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
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full block">
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
        stroke="#243456"
        strokeDasharray="4 4"
      />
      <line
        x1={paddingX}
        y1={height - paddingY}
        x2={width - paddingX}
        y2={height - paddingY}
        stroke="#243456"
      />

      {/* Área y línea */}
      <path d={areaD} fill="url(#areaGradient)" />
      <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Puntos destacados */}
      <circle cx={coords[0].x} cy={coords[0].y} r="3.5" fill="#38bdf8" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

      {/* Etiquetas de fechas */}
      <text x={paddingX} y={height - 8} fill="#94a3b8" fontSize="11" textAnchor="start" fontFamily="sans-serif">
        {points[0].fecha}
      </text>
      <text x={width - paddingX} y={height - 8} fill="#94a3b8" fontSize="11" textAnchor="end" fontFamily="sans-serif">
        {points[points.length - 1].fecha}
      </text>
    </svg>
  );
}
