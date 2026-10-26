import React from "react";
import { Scale, ShieldCheck, Database, RefreshCw } from "lucide-react";

export function Methodology() {
  const points = [
    {
      icon: Scale,
      title: "Ponderación por gasto",
      desc: "Carnes (22%), Almacén (20%) y Lácteos (15%) representan más de la mitad del índice para reflejar el consumo familiar real.",
    },
    {
      icon: ShieldCheck,
      title: "Filtro de anomalías",
      desc: "Se descartan saltos mayores al 100% o caídas superiores al 50% en un solo día, que suelen responder a equivocaciones tipográficas del supermercado.",
    },
    {
      icon: Database,
      title: "Catálogo directo y con stock",
      desc: "Solo se computan artículos con disponibilidad inmediata y entrega directa de Carrefour, excluyendo vendedores externos.",
    },
    {
      icon: RefreshCw,
      title: "Corte diario automatizado",
      desc: "El relevamiento corre de forma autónoma todas las mañanas y guarda el registro histórico en PostgreSQL.",
    },
  ];

  return (
    <div className="relative mt-10 mb-6">
      <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
        DOCUMENTACIÓN TÉCNICA — METODOLOGÍA Y CRITERIOS
      </div>

      <div className="paper-card sketch-frame p-5 sm:p-7 space-y-4">
        <div className="corner-ticks"></div>
        <div>
          <h3 className="font-['Oswald'] text-xl font-bold tracking-[1px] text-[#141413] uppercase">
            ESTÁNDAR DE MEDICIÓN Y TRANSPARENCIA
          </h3>
          <p className="text-xs sm:text-sm font-mono text-[#4a4845]">
            Criterios de normalización aplicados sobre el catálogo público digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-dashed border-[#7c766e]">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="space-y-1.5 font-mono">
                <div className="flex items-center gap-2 text-[#141413]">
                  <Icon className="h-4 w-4 text-[#a62626] flex-shrink-0" />
                  <h4 className="font-['Oswald'] text-sm font-bold tracking-wide uppercase text-[#141413]">
                    {p.title}
                  </h4>
                </div>
                <p className="text-xs text-[#4a4845] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
