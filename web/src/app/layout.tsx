import type { Metadata } from "next";
import { Anton, Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="es" className={`${anton.variable} ${oswald.variable} ${mono.variable}`}>
      <body className="min-h-[100dvh] bg-[#090a0c] text-[#e6dfd5] antialiased selection:bg-[#a62626]/30 selection:text-[#e6dfd5]">
        {children}
      </body>
    </html>
  );
}
