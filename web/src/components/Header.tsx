import React from "react";
import { Send } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full bg-surface-50/85 border-b border-surface-border backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-md bg-surface-100 p-0.5 border border-surface-border flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="Logo Carrefour Tracker"
              className="h-full w-full object-contain rounded-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-slate-100">
                Carrefour Tracker
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En vivo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Precios y variación diaria de góndola online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">Relevamiento</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono tabular-nums">{formatFecha(fechaHoy)}</span>
          </div>

          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-surface-100 hover:bg-surface-200 border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors duration-150 active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5 text-brand-400" />
            <span className="hidden sm:inline">Bot de Alertas</span>
            <span className="sm:hidden">Bot</span>
          </a>
        </div>
      </div>
    </header>
  );
}
