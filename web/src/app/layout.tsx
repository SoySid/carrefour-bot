import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrefour Monitor | Inflación y Precios de Supermercado en Vivo",
  description:
    "Seguimiento diario de precios e inflación en tiempo real sobre el catálogo oficial de Carrefour Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-surface-50 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
