import React from "react";

export function Methodology() {
  const points = [
    {
      title: "Extracción exhaustiva sin truncar",
      desc: "Desglose por subcategorías en la API oficial de VTEX, abarcando más de 25.000 artículos y superando el límite tradicional de 2.500 resultados de la plataforma.",
    },
    {
      title: "Stock real y venta directa",
      desc: "Solo se computan productos con stock positivo disponible y vendidos directamente por Carrefour (sellerId=1), excluyendo marketplace o publicaciones de terceros.",
    },
    {
      title: "Cálculo de variación interdiaria",
      desc: "La variación de la canasta compara cada producto contra su precio registrado el día previo y contra el cierre o apertura del mes en curso.",
    },
    {
      title: "Pipeline matutino automatizado",
      desc: "El relevamiento se ejecuta diariamente a las 08:35 ART mediante GitHub Actions y persiste el histórico en Neon PostgreSQL.",
    },
  ];

  return (
    <section id="metodologia" className="space-y-6 pt-6 sm:pt-8 animate-enter delay-150">
      <div className="rounded-2xl bg-surface-100 p-6 sm:p-8 lg:p-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Metodología y Criterios Técnicos
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-prose">
            Reglas de auditoría y extracción aplicadas en cada relevamiento diario para garantizar precisión estadística y transparencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {points.map((p, idx) => (
            <div
              key={idx}
              className={`space-y-2 border-l-2 border-brand-500/50 pl-4 animate-enter ${
                idx === 0 ? "delay-150" : idx === 1 ? "delay-225" : idx === 2 ? "delay-300" : "delay-375"
              }`}
            >
              <h3 className="text-lg font-bold text-white">
                {p.title}
              </h3>
              <p className="text-base text-slate-300 leading-relaxed max-w-prose">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
