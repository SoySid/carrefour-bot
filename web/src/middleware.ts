import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger endpoints de API
  if (pathname.startsWith("/api/")) {
    // 1. Restringir a métodos seguros de solo lectura
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new NextResponse(
        JSON.stringify({ error: "Método no permitido" }),
        { status: 405, headers: { "Content-Type": "application/json", Allow: "GET, HEAD" } }
      );
    }

    // 2. Extraer identificador de cliente (IP real detrás de reverse proxy o socket)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
    const routeKey = `${ip}:${pathname.split("/")[2] || "api"}`;

    // Límite de 30 peticiones por minuto por IP
    const rateCheck = checkRateLimit(routeKey, 30, 60 * 1000);

    if (!rateCheck.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Demasiadas peticiones. Por favor espere unos segundos.",
          retryAfter: rateCheck.retryAfterSec,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateCheck.retryAfterSec),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
