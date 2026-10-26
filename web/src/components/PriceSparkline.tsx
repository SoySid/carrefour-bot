"use client";

import React from "react";
import { PricePoint } from "@/lib/types";

interface PriceSparklineProps {
  data: PricePoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export function PriceSparkline({
  data,
  width = 280,
  height = 56,
  showLabels = true,
}: PriceSparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div className="py-2 text-[11px] text-ink-500 font-mono">
        Datos insuficientes para trazar la curva
      </div>
    );
  }

  const prices = data.map((d) => d.precio);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const paddingX = 6;
  const paddingY = 6;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * graphWidth;
    const y = height - paddingY - ((d.precio - minPrice) / range) * graphHeight;
    return { x, y, price: d.precio, date: d.fecha };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaD = `${pathD} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  const isUp = lastPoint.price > firstPoint.price;
  const isDown = lastPoint.price < firstPoint.price;
  const strokeColor = isUp ? "#D92D20" : isDown ? "#067647" : "#004E98";
  const fillColor = isUp
    ? "rgba(217, 45, 32, 0.08)"
    : isDown
    ? "rgba(6, 118, 71, 0.08)"
    : "rgba(0, 78, 152, 0.08)";

  const formatShortCurrency = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDateLabel = (f: string) => {
    const parts = f.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : f;
  };

  return (
    <div className="w-full space-y-1">
      <div className="overflow-hidden rounded bg-paper-50 border border-paper-border/60 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <path d={areaD} fill={fillColor} />
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? 3 : 1.5}
              fill={i === points.length - 1 ? strokeColor : "#FFFFFF"}
              stroke={strokeColor}
              strokeWidth={i === points.length - 1 ? 1.5 : 1}
            />
          ))}
        </svg>

        {showLabels && (
          <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-ink-500 pt-1.5 border-t border-paper-border/40">
            <span>
              {formatDateLabel(firstPoint.date)}: {formatShortCurrency(firstPoint.price)}
            </span>
            <span className="font-semibold text-ink-900">
              {formatDateLabel(lastPoint.date)}: {formatShortCurrency(lastPoint.price)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
