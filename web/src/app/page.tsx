import React from "react";
import { getDashboardData } from "@/lib/queries";
import { Header } from "@/components/Header";
import { HeroStats } from "@/components/HeroStats";
import { ProductSearch } from "@/components/ProductSearch";
import { CategoryAndMovers } from "@/components/CategoryAndMovers";
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
    <div className="min-h-[100dvh] flex flex-col bg-paper-100 text-ink-900 selection:bg-carrefour-blue/15 selection:text-carrefour-blue">
      <Header fechaHoy={data.stats.fechaHoy} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 space-y-8 pt-6 sm:pt-8 pb-12">
        {/* Portada Macro Editorial + Ticket Changuito */}
        <HeroStats stats={data.stats} changuito={data.changuito} />

        {/* Buscador Interactivo con fotos e historial SVG */}
        <ProductSearch />

        {/* Radar de Góndola: Rubros y Movimientos en Tabs */}
        <CategoryAndMovers
          categorias={data.categorias}
          topSubas={data.topSubas}
          topBajas={data.topBajas}
        />

        {/* Metodología */}
        <Methodology />
      </main>

      <footer className="border-t border-paper-border bg-paper-200/50 py-8 text-xs text-ink-500 font-mono">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Carrefour Tracker • Relevamiento diario de precios con fines informativos y de transparencia.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/sidarg/carrefour-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://t.me/carrefour_monitor_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-900 transition-colors"
            >
              Canal en Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
