import React from "react";
import { ShieldCheck, Scale, Database, Clock } from "lucide-react";

export function Methodology() {
  const criteria = [
    {
      icon: Scale,
      title: "Ponderación por gasto",
      desc: "Basado en la proporción de gasto del hogar (Carnes 22%, Almacén 20%, Lácteos 15%), para evitar distorsiones de rubros secundarios.",
    },
    {
      icon: ShieldCheck,
      title: "Filtro de errores",
      desc: "Se descartan saltos atípicos (>100% o caídas >50% en 24h) producidos por desajustes transitorios de góndola digital.",
    },
    {
      icon: Database,
      title: "Stock directo Carrefour",
      desc: "Se relevan únicamente artículos con disponibilidad inmediata y despacho directo, excluyendo publicaciones de terceros.",
    },
    {
      icon: Clock,
      title: "Frecuencia diaria",
      desc: "El relevamiento corre cada mañana mediante GitHub Actions y persiste la serie histórica en PostgreSQL.",
    },
  ];

  return (
    <section className="pt-4 border-t border-surface-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {criteria.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Icon className="h-3.5 w-3.5 text-brand-400" />
                <h3 className="text-xs font-semibold text-slate-200">
                  {c.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
