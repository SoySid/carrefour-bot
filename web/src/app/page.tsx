import React from "react";
import { getDashboardData } from "@/lib/queries";
import { Header } from "@/components/Header";
import { HeroStats } from "@/components/HeroStats";
import { ProductSearch } from "@/components/ProductSearch";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { TopMovers } from "@/components/TopMovers";
import { Methodology } from "@/components/Methodology";
import { DashboardData } from "@/lib/types";

// Revalidar cada 1 hora para máxima velocidad y ahorro de recursos en Neon
export const revalidate = 3600;

export default async function HomePage() {
  let data: DashboardData;

  try {
    data = await getDashboardData();
  } catch (err) {
    console.error("Error al cargar datos del dashboard:", err);
    data = {
      stats: {
        fechaHoy: new Date().toISOString().split("T")[0],
        fechaAyer: "",
        fechaMes: "",
        totalMonitoreados: 0,
        conVarDia: 0,
        varDiaGeneral: 0,
        varMesGeneral: 0,
        subieronDia: 0,
        bajaronDia: 0,
        igualesDia: 0,
      },
      categorias: [],
      topSubas: [],
      topBajas: [],
    };
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-surface-50 text-slate-100 bg-dot-grid relative selection:bg-brand-500/30 selection:text-white">
      <Header fechaHoy={data.stats.fechaHoy} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 space-y-12 sm:space-y-16 pt-6 sm:pt-8 pb-12">
        <HeroStats stats={data.stats} changuito={data.changuito} />
        <ProductSearch />
        <CategoryBreakdown categorias={data.categorias} />
        <TopMovers topSubas={data.topSubas} topBajas={data.topBajas} />
        <Methodology />
      </main>

      <footer className="mt-20 border-t border-surface-border bg-surface-100 py-10 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Carrefour Tracker. Datos públicos de góndola para seguimiento de precios.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/sidarg/carrefour-bot" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
              Repositorio GitHub
            </a>
            <a href="https://t.me/carrefour_monitor_bot" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
              Bot en Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
