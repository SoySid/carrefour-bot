import { NextRequest, NextResponse } from "next/server";
import { getProductHistory } from "@/lib/queries";
import { ProductIdSchema } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const parsed = ProductIdSchema.safeParse(params.id);

  if (!parsed.success) {
    return NextResponse.json({ error: "Identificador de producto inválido" }, { status: 400 });
  }

  try {
    const history = await getProductHistory(parsed.data);
    return NextResponse.json(history, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error al obtener historial");
    return NextResponse.json({ error: "Error al consultar historial" }, { status: 500 });
  }
}
