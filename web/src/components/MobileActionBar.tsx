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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-100 md:hidden">
      <div className="grid grid-cols-4 items-center justify-around px-2 py-2.5 text-center">
        <button
          onClick={() => scrollTo("canasta")}
          className="flex flex-col items-center gap-1 py-1 text-slate-300 hover:text-white transition-colors"
        >
          <Activity className="h-5 w-5 text-brand-400" />
          <span className="text-xs font-medium">Canasta</span>
        </button>

        <button
          onClick={() => scrollTo("rubros")}
          className="flex flex-col items-center gap-1 py-1 text-slate-300 hover:text-white transition-colors"
        >
          <Tag className="h-5 w-5" />
          <span className="text-xs font-medium">Rubros</span>
        </button>

        <button
          onClick={() => scrollTo("buscador")}
          className="flex flex-col items-center gap-1 py-1 text-slate-300 hover:text-white transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-xs font-medium">Buscador</span>
        </button>

        <a
          href="https://t.me/carrefour_monitor_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 text-slate-300 hover:text-white transition-colors"
        >
          <Send className="h-5 w-5 text-brand-400" />
          <span className="text-xs font-medium">Telegram</span>
        </a>
      </div>
    </div>
  );
}
