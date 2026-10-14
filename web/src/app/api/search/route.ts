import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const products = await searchProducts(q);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ error: "Error al consultar productos" }, { status: 500 });
  }
}
