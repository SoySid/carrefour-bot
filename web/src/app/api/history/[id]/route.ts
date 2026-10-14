import { NextRequest, NextResponse } from "next/server";
import { getProductHistory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  try {
    const history = await getProductHistory(id);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json({ error: "Error al consultar historial" }, { status: 500 });
  }
}
