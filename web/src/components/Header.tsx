import React from "react";
import { Send, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  fechaHoy: string;
}

export function Header({ fechaHoy }: HeaderProps) {
  return (
    <header className="w-full pt-4 pb-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Logo tipográfico Anton gigante de la prueba */}
        <div className="font-['Anton'] text-4xl sm:text-5xl lg:text-[3.15rem] leading-[0.88] tracking-[1.5px] text-[#e6dfd5] uppercase drop-shadow-[2px_2px_0px_#000] select-none">
          CARREFOUR<br />TRACKER
          <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#e6dfd5] align-baseline ml-1.5 mb-1" />
        </div>

        {/* Acceso a Telegram y GitHub en estética sobria */}
        <div className="flex items-center gap-3">
          <a
            href="https://t.me/carrefour_monitor_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#e6dfd5]/40 hover:border-[#e6dfd5] text-[#e6dfd5] text-xs font-mono font-semibold transition-colors bg-white/5 rounded"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Alertas Telegram</span>
            <ArrowUpRight className="h-3 w-3 opacity-70" />
          </a>
          <a
            href="https://github.com/sidarg/carrefour-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#e6dfd5]/40 hover:border-[#e6dfd5] text-[#e6dfd5] text-xs font-mono font-semibold transition-colors bg-white/5 rounded"
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Línea divisoria arquitectónica */}
      <div className="w-full h-[2px] mt-4 mb-2 border-t border-[#e6dfd5]/35 border-b border-dashed border-[#e6dfd5]/20" />
    </header>
  );
}
