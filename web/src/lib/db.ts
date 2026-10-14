import { neon, neonConfig } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("DATABASE_URL no está configurada en las variables de entorno.");
}

export const sql = neon(connectionString);
