import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/queries";
import { SearchQuerySchema } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q") || "";

  const parsed = SearchQuerySchema.safeParse(rawQ);
  if (!parsed.success) {
    if (rawQ.trim().length < 2) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: "Parámetro de búsqueda inválido" },
      { status: 400 }
    );
  }

  try {
    const products = await searchProducts(parsed.data);
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error en búsqueda");
    return NextResponse.json({ error: "Error al consultar productos" }, { status: 500 });
  }
}
