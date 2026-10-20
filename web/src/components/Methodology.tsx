import React from "react";

export function Methodology() {
  const points = [
    {
      title: "Canasta Familiar Ponderada (IPC)",
      desc: "El índice general pondera el impacto de cada departamento según la estructura de consumo familiar (ej. Carnes 22%, Almacén 20%, Lácteos 15%), evitando que rubros con exceso de artículos desvíen la medición.",
    },
    {
      title: "Filtro riguroso anti-outliers",
      desc: "Exclusión de subcategorías no esenciales (mopas, cestos automáticos, ortopedia, maquillaje) y acotación estadística de variaciones extremas causadas por errores de carga en góndola.",
    },
    {
      title: "Stock real y venta directa Carrefour",
      desc: "Solo se computan productos con stock positivo disponible y vendidos directamente por Carrefour (sellerId=1), excluyendo publicaciones de terceros y precios placeholder de marketplace.",
    },
    {
      title: "Pipeline matutino automatizado",
      desc: "El relevamiento se ejecuta diariamente a las 08:35 ART mediante GitHub Actions y persiste el histórico en Neon PostgreSQL con sincronización de estado activo.",
    },
  ];

  return (
    <section id="metodologia" className="space-y-6 pt-6 sm:pt-8 animate-enter delay-150">
      <div className="rounded-2xl bg-surface-100 border border-surface-200 p-6 sm:p-8 lg:p-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Metodología y criterios de relevamiento
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-prose">
            Criterios técnicos aplicados en cada ejecución diaria para asegurar consistencia y trazabilidad en los datos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {points.map((p, idx) => (
            <div
              key={idx}
              className={`space-y-2 border-l-2 border-brand-500 pl-4 animate-enter ${
                idx === 0 ? "delay-150" : idx === 1 ? "delay-225" : idx === 2 ? "delay-300" : "delay-375"
              }`}
            >
              <h3 className="text-base font-bold text-white">
                {p.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-prose">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
