import React from "react";
import { Send, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  fechaHoy: string;
}

export function Header({ fechaHoy }: HeaderProps) {
  const formatFecha = (f: string) => {
    if (!f) return "Hoy";
    const parts = f.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return f;
  };

  return (
    <header className="border-b border-paper-border bg-paper-50 sticky top-0 z-40">
      {/* Barra superior de corte */}
      <div className="border-b border-paper-border/60 py-1 px-4 sm:px-6 text-[11px] font-mono text-ink-500">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Corte matutino: {formatFecha(fechaHoy)}</span>
            <span className="hidden sm:inline text-paper-border">•</span>
            <span className="hidden sm:inline">Carrefour Argentina (tienda digital directa)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sidarg/carrefour-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-900 transition-colors"
            >
              Código fuente
            </a>
          </div>
        </div>
      </div>

      {/* Cabezal principal */}
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded border border-paper-border overflow-hidden bg-white p-0.5 flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Carrefour Tracker"
              className="h-full w-full object-contain rounded-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-ink-900">
                Carrefour Tracker
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-paper-200 border border-paper-border text-ink-700 rounded">
                Góndola AR
              </span>
            </div>
            <p className="text-xs text-ink-500 hidden sm:block">
              Relevamiento diario de precios con ponderación de canasta familiar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded bg-ink-900 hover:bg-ink-700 text-paper-50 px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5 text-paper-100" />
            <span>Bot de Telegram</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
}
