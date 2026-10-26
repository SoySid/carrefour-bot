import React from "react";
import { Send, ArrowUpRight, Activity } from "lucide-react";

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
    <header className="border-b border-paper-border bg-white sticky top-0 z-40 shadow-sm">
      {/* Barra superior de corte */}
      <div className="border-b border-paper-border/60 bg-paper-100 py-1.5 px-4 sm:px-6 text-[11px] font-mono text-ink-500">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Relevamiento activo
            </span>
            <span className="text-ink-700 font-medium">Corte: {formatFecha(fechaHoy)}</span>
            <span className="hidden sm:inline text-paper-border">•</span>
            <span className="hidden sm:inline text-ink-500">Carrefour Digital Argentina</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sidarg/carrefour-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-carrefour-blue transition-colors font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Cabezal principal */}
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg border border-blue-200 overflow-hidden bg-blue-50 p-0.5 flex-shrink-0 shadow-sm">
            <img
              src="/logo.jpg"
              alt="Carrefour Tracker"
              className="h-full w-full object-contain rounded"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-ink-900">
                Carrefour Tracker
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-blue-50 text-carrefour-blue border border-blue-200 rounded-full">
                Índice de Góndola
              </span>
            </div>
            <p className="text-xs text-ink-500 hidden sm:block">
              Monitoreo diario de precios sobre el catálogo digital oficial
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-carrefour-blue hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5 text-blue-100" />
            <span>Alertas Telegram</span>
            <ArrowUpRight className="h-3 w-3 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
}
