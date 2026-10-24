import React from "react";
import { ShieldCheck, Scale, Database, Clock } from "lucide-react";

export function Methodology() {
  const criteria = [
    {
      icon: Scale,
      title: "Ponderación por gasto",
      desc: "Se calcula según la proporción de gasto en el hogar (Carnes 22%, Almacén 20%, Lácteos 15%), para que rubros secundarios con muchos artículos no alteren el promedio.",
    },
    {
      icon: ShieldCheck,
      title: "Control de errores de carga",
      desc: "Se descartan subas mayores al 100% o caídas superiores al 50% en un solo día, que suelen responder a errores de tipeo momentáneos en góndola digital.",
    },
    {
      icon: Database,
      title: "Solo stock directo Carrefour",
      desc: "Se computan únicamente artículos con disponibilidad inmediata vendidos de forma directa, excluyendo publicaciones sin stock y tiendas terceras del marketplace.",
    },
    {
      icon: Clock,
      title: "Horario de relevamiento",
      desc: "El proceso se ejecuta de forma automática todas las mañanas mediante GitHub Actions y guarda el registro diario en PostgreSQL para armar el histórico.",
    },
  ];

  return (
    <section className="space-y-4 pt-6 border-t border-surface-border/60">
      <div className="max-w-2xl space-y-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
          Cómo se calculan los datos
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Criterios aplicados en cada corte diario para mantener la coherencia de la serie de precios.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {criteria.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-brand-400">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <h3 className="text-xs font-bold text-slate-200">
                  {c.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
