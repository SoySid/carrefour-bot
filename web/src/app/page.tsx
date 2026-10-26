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
    <div className="min-h-[100dvh] flex flex-col bg-[#090a0c] text-[#e6dfd5] selection:bg-[#a62626]/30 selection:text-[#e6dfd5] relative overflow-x-hidden font-mono">
      {/* Textura de fondo y viñeta sutil */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(45, 48, 52, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(35, 38, 42, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(40, 42, 46, 0.35) 0%, transparent 55%), linear-gradient(135deg, #070809 0%, #121417 50%, #060708 100%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col space-y-8">
        <Header fechaHoy={data.stats.fechaHoy} />

        {data.stats.totalMonitoreados === 0 && (
          <div className="p-4 border-2 border-[#a62626] bg-[#141413] text-[#e6dfd5] font-mono text-xs sm:text-sm space-y-1">
            <div className="text-[#a62626] font-bold uppercase tracking-wider">
              AVISO DE CONEXIÓN
            </div>
            <div>
              No se pudo obtener el relevamiento del corte actual desde la base de datos. Los valores mostrados abajo son datos por defecto mientras se restablece el servicio.
            </div>
          </div>
        )}

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
      </div>

      <footer className="relative z-10 border-t border-[#e6dfd5]/20 bg-black/40 py-6 text-xs text-[#b8b0a6] font-mono">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Carrefour Tracker • Relevamiento diario de precios con fines informativos y de transparencia.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/sidarg/carrefour-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e6dfd5] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://t.me/carrefour_monitor_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e6dfd5] transition-colors"
            >
              Canal en Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
