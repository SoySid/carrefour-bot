import React from "react";
import { Activity, Send } from "lucide-react";

interface HeaderProps {
  fechaHoy: string;
}

export function Header({ fechaHoy }: HeaderProps) {
  // Formatear fecha a DD/MM/AAAA si está en formato YYYY-MM-DD
  const formatFecha = (f: string) => {
    if (!f) return "Hoy";
    const parts = f.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return f;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-500 ring-1 ring-brand-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">
                Carrefour Monitor
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En vivo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Índice diario de precios e inflación de supermercado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs text-slate-400 sm:block">
            <span className="block font-medium text-slate-300">Corte diario</span>
            <span>{formatFecha(fechaHoy)}</span>
          </div>
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-surface-200 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-surface-300 hover:text-white ring-1 ring-surface-border"
          >
            <Send className="h-3.5 w-3.5 text-brand-500" />
            <span className="hidden sm:inline">Canal Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
