import React from "react";
import { ShieldCheck, Database, Cpu, Clock } from "lucide-react";

export function Methodology() {
  const points = [
    {
      icon: Database,
      title: "Catálogo Completo sin Truncar",
      desc: "Desglose por subcategorías en la API oficial de VTEX, abarcando más de 25.000 artículos y superando el límite tradicional de 2.500 resultados.",
    },
    {
      icon: ShieldCheck,
      title: "Filtro de Stock Real y Oficial",
      desc: "Solo se computan productos con stock positivo disponible y vendidos directamente por Carrefour (sellerId=1), excluyendo marketplace de terceros.",
    },
    {
      icon: Cpu,
      title: "Cálculo Ponderado Diario",
      desc: "La variación de la canasta compara cada producto contra su precio registrado el día previo y contra el cierre o apertura del mes en curso.",
    },
    {
      icon: Clock,
      title: "Ejecución Matutina Automatizada",
      desc: "El rastreo se ejecuta automáticamente todos los días a las 08:35 ART mediante GitHub Actions e inserta los datos en Neon PostgreSQL.",
    },
  ];

  return (
    <section id="metodologia" className="space-y-4 pt-4 sm:pt-6">
      <div className="border-b border-surface-border pb-3">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
          Metodología y Criterios Técnicos
        </h2>
        <p className="text-xs text-zinc-400 sm:text-sm">
          Criterios de extracción y cálculo aplicados en cada relevamiento diario.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-surface-border bg-surface-100 p-4 transition-colors hover:border-zinc-700/80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-200 border border-white/5 text-blue-400 mb-3">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">
                {p.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
