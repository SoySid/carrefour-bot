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
    <header data-ui="true" className="sticky top-0 z-40 w-full bg-surface-100/95 border-b border-surface-200 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-9 w-9 overflow-hidden rounded-md bg-surface-100 p-0.5 border border-surface-200 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo.jpg"
                alt="Logo Carrefour Tracker"
                className="h-full w-full object-contain rounded"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-brand-400 transition-colors">
                Carrefour Tracker
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-200 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Actualizado a diario</span>
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#canasta" className="hover:text-white transition-colors">
              Canasta
            </a>
            <a href="#buscador" className="hover:text-white transition-colors">
              Buscador
            </a>
            <a href="#rubros" className="hover:text-white transition-colors">
              Rubros
            </a>
            <a href="#movimientos" className="hover:text-white transition-colors">
              Subas y bajas
            </a>
            <a href="#metodologia" className="hover:text-white transition-colors">
              Metodología
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="block text-sm text-slate-400">Último corte</span>
            <span className="text-sm font-medium text-white tabular-nums">{formatFecha(fechaHoy)}</span>
          </div>
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:bg-brand-500 active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Canal Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
