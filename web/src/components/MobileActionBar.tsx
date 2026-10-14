"use client";

import React from "react";
import { Activity, Tag, Search, Send } from "lucide-react";

export function MobileActionBar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-border bg-surface-50/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-4 items-center justify-around px-2 py-2 text-center">
        <button
          onClick={() => scrollTo("canasta")}
          className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <Activity className="h-4 w-4 text-brand-500" />
          <span className="text-[10px] font-medium">Canasta</span>
        </button>

        <button
          onClick={() => scrollTo("categorias")}
          className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <Tag className="h-4 w-4" />
          <span className="text-[10px] font-medium">Rubros</span>
        </button>

        <button
          onClick={() => scrollTo("buscador")}
          className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="text-[10px] font-medium">Buscador</span>
        </button>

        <a
          href="https://t.me/carrefour_monitor_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <Send className="h-4 w-4 text-brand-400" />
          <span className="text-[10px] font-medium">Telegram</span>
        </a>
      </div>
    </div>
  );
}
