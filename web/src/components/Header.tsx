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
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-white p-0.5 shadow-sm transition-transform group-hover:scale-105">
              <img
                src="/logo.jpg"
                alt="Logo Carrefour Tracker"
                className="h-full w-full object-contain rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                Carrefour Tracker
              </span>
              <span className="hidden sm:inline-block rounded bg-surface-200 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border border-white/5">
                IPC Diario
              </span>
            </div>
          </a>

          {/* Enlaces de navegación en escritorio */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-400">
            <a href="#canasta" className="hover:text-zinc-100 transition-colors">
              Canasta
            </a>
            <a href="#buscador" className="hover:text-zinc-100 transition-colors">
              Buscador
            </a>
            <a href="#categorias" className="hover:text-zinc-100 transition-colors">
              Rubros
            </a>
            <a href="#movimientos" className="hover:text-zinc-100 transition-colors">
              Subas y Bajas
            </a>
            <a href="#metodologia" className="hover:text-zinc-100 transition-colors">
              Metodología
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs text-zinc-400 sm:block">
            <span className="block text-[11px] text-zinc-500">Corte diario</span>
            <span className="text-zinc-300 font-mono text-xs">{formatFecha(fechaHoy)}</span>
          </div>
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface-200 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-all hover:bg-surface-300 hover:text-white"
          >
            <Send className="h-3.5 w-3.5 text-blue-400" />
            <span>Canal Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
