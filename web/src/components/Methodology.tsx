import React from "react";
import { Scale, ShieldCheck, Database, RefreshCw } from "lucide-react";

export function Methodology() {
  const points = [
    {
      icon: Scale,
      title: "Ponderación por consumo",
      desc: "La canasta asigna mayor peso a carnes (22%), almacén (20%) y lácteos (15%), siguiendo la distribución del gasto familiar.",
    },
    {
      icon: ShieldCheck,
      title: "Filtro de valores extremos",
      desc: "Se omiten variaciones diarias mayores al 100% o caídas superiores al 50% para descartar errores de carga en góndola digital.",
    },
    {
      icon: Database,
      title: "Artículos con disponibilidad",
      desc: "Solo se relevan productos con entrega directa de Carrefour y stock confirmado, sin vendedores externos del marketplace.",
    },
    {
      icon: RefreshCw,
      title: "Actualización diaria",
      desc: "El sistema releva el catálogo cada mañana y almacena los precios para construir la serie histórica.",
    },
  ];

  return (
    <div className="relative mt-10 mb-6">
      <div className="inline-block bg-[#dcd4c9] text-[#141413] font-['Oswald'] text-xs sm:text-sm font-semibold tracking-[1.2px] px-3.5 py-1 border-2 border-[#181715] border-b-0 relative z-10 ml-3 shadow-[-2px_-2px_0_rgba(230,223,213,0.4)]">
        DOCUMENTACIÓN TÉCNICA — METODOLOGÍA Y CRITERIOS
      </div>

      <div className="paper-card sketch-frame p-5 sm:p-7 space-y-4">
        <div className="corner-ticks"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
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
