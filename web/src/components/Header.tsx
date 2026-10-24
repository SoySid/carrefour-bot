import React from "react";
import { Send, GitFork } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full bg-surface-50/90 border-b border-surface-border backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-lg bg-surface-100 p-1 border border-surface-border flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Logo Carrefour Tracker"
              className="h-full w-full object-contain rounded"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-100">
                Carrefour Tracker
              </span>
              <span className="hidden sm:inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold bg-surface-200 text-slate-300 border border-surface-border">
                Góndola AR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Seguimiento diario de precios de góndola
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="text-right">
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Último corte</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono tabular-nums">{formatFecha(fechaHoy)}</span>
          </div>

          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors duration-150 active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Alertas en Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
