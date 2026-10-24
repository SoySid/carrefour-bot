import React from "react";
import { ShieldCheck, Scale, Database, Clock } from "lucide-react";

export function Methodology() {
  const criteria = [
    {
      icon: Scale,
      title: "Ponderación por gasto del hogar",
      desc: "El índice general pondera cada rubro según la estructura de consumo familiar (Carnes 22%, Almacén 20%, Lácteos 15%), impidiendo que categorías con miles de artículos secundarios distorsionen el resultado.",
    },
    {
      icon: ShieldCheck,
      title: "Filtrado de anomalías y outliers",
      desc: "Se excluyen errores evidentes de carga de góndola (subas superiores al 100% o caídas mayores al 50% en 24h) y artículos que no pertenecen al consumo esencial.",
    },
    {
      icon: Database,
      title: "Stock activo y venta directa",
      desc: "Solo se computan artículos con stock disponible despachados directamente por Carrefour, descartando publicaciones sin disponibilidad y vendedores externos del marketplace.",
    },
    {
      icon: Clock,
      title: "Corte diario matutino",
      desc: "El barrido se ejecuta todas las mañanas de forma automatizada mediante GitHub Actions y persiste el histórico en Neon PostgreSQL para trazabilidad temporal.",
    },
  ];

  return (
    <section className="space-y-4 pt-4 sm:pt-6">
      <div className="rounded-xl bg-surface-100 border border-surface-border p-5 sm:p-7 space-y-6">
        <div className="max-w-2xl space-y-1">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
            Criterios Técnicos y Metodología
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Reglas de consistencia aplicadas en cada relevamiento para asegurar trazabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {criteria.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="space-y-2 rounded-lg bg-surface-200/40 p-3.5 border border-surface-border/60"
              >
                <div className="flex items-center gap-2 text-brand-400">
                  <Icon className="h-4 w-4" />
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
      </div>
    </section>
  );
}
