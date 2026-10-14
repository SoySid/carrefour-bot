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
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30 transition-colors group-hover:bg-brand-500/25">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">
                  Carrefour Tracker
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Corte diario
                </span>
              </div>
            </div>
          </a>

          {/* Enlaces de navegación en escritorio */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-400">
            <a href="#canasta" className="hover:text-slate-200 transition-colors">
              Canasta
            </a>
            <a href="#buscador" className="hover:text-slate-200 transition-colors">
              Buscador
            </a>
            <a href="#categorias" className="hover:text-slate-200 transition-colors">
              Categorías
            </a>
            <a href="#movimientos" className="hover:text-slate-200 transition-colors">
              Subas y Bajas
            </a>
            <a href="#metodologia" className="hover:text-slate-200 transition-colors">
              Metodología
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs text-slate-400 sm:block">
            <span className="block font-medium text-slate-300">Actualizado</span>
            <span className="text-slate-400 font-mono text-[11px]">{formatFecha(fechaHoy)}</span>
          </div>
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-brand-600/20 px-3 py-1.5 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30 transition-all hover:bg-brand-600/30 hover:text-white"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Reportes Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
