import React from "react";
import { getDashboardData } from "@/lib/queries";
import { Header } from "@/components/Header";
import { HeroStats } from "@/components/HeroStats";
import { ProductSearch } from "@/components/ProductSearch";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { TopMovers } from "@/components/TopMovers";
import { Methodology } from "@/components/Methodology";
import { MobileActionBar } from "@/components/MobileActionBar";
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
    <div className="min-h-screen flex flex-col pb-20 md:pb-12">
      <Header fechaHoy={data.stats.fechaHoy} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 space-y-8 sm:space-y-12">
        <HeroStats stats={data.stats} />
        <ProductSearch />
        <CategoryBreakdown categorias={data.categorias} />
        <TopMovers topSubas={data.topSubas} topBajas={data.topBajas} />
        <Methodology />
      </main>

      <footer className="mt-16 border-t border-surface-border bg-surface-100 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Carrefour Monitor. Datos públicos obtenidos con fines informativos y analíticos.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com/sidarg/carrefour-bot" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">
              GitHub
            </a>
            <a href="https://t.me/carrefour_monitor_bot" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">
              Canal Telegram
            </a>
          </div>
        </div>
      </footer>

      <MobileActionBar />
    </div>
  );
}
