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
      title: "Filtro de errores de góndola",
      desc: "Se descartan saltos mayores al 100% o caídas superiores al 50% en un solo día, que suelen responder a equivocaciones tipográficas del supermercado.",
    },
    {
      icon: Database,
      title: "Catálogo directo y con stock",
      desc: "Solo se computan artículos con disponibilidad inmediata y entrega directa de Carrefour, excluyendo vendedores externos.",
    },
    {
      icon: RefreshCw,
      title: "Corte diario automático",
      desc: "El relevamiento corre de forma autónoma todas las mañanas y guarda el registro histórico en PostgreSQL.",
    },
  ];

  return (
    <section className="border-t border-paper-border pt-8 pb-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-ink-700">
          Metodología y criterios de cálculo
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-ink-900">
                <Icon className="h-4 w-4 text-carrefour-blue flex-shrink-0" />
                <h4 className="text-xs font-bold text-ink-900">{p.title}</h4>
              </div>
              <p className="text-xs text-ink-500 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
