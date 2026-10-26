import { z } from "zod";

export const SearchQuerySchema = z
  .string()
  .trim()
  .min(2, "La búsqueda debe tener al menos 2 caracteres")
  .max(60, "La búsqueda no puede superar los 60 caracteres")
  .regex(/^[^<>{}[\]`$\0]+$/, "Caracteres no permitidos en la búsqueda");

export const ProductIdSchema = z
  .string()
  .trim()
  .min(1, "ID requerido")
  .max(30, "ID demasiado largo")
  .regex(/^[a-zA-Z0-9_-]+$/, "ID inválido");

const ALLOWED_HOSTS = new Set([
  "carrefour.com.ar",
  "www.carrefour.com.ar",
  "vteximg.com.br",
  "vtexassets.com",
]);

export function safeExternalUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    const hostname = parsed.hostname.toLowerCase();
    const isAllowed =
      ALLOWED_HOSTS.has(hostname) ||
      Array.from(ALLOWED_HOSTS).some((domain) => hostname.endsWith("." + domain));
    return isAllowed ? parsed.toString() : null;
  } catch {
    return null;
  }
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();

  if (rateLimitMap.size > 5000) {
    rateLimitMap.forEach((value, key) => {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    });
  }

  const existing = rateLimitMap.get(identifier);
  if (!existing || now > existing.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
