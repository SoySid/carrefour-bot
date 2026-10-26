import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrefour Tracker | Seguimiento diario de precios de góndola",
  description: "Monitor público e independiente de precios, variaciones y canasta básica en Carrefour Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Oswald:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100dvh] bg-paper-100 text-ink-900 antialiased selection:bg-carrefour-blue/15 selection:text-carrefour-blue">
        {children}
      </body>
    </html>
  );
}
