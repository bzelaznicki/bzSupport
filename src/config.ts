import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
await load({ export: true });

function requireEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  appEnv: requireEnv("APP_ENV"),
  dbUrl: requireEnv("DATABASE_URL"),
  port: parseInt(Deno.env.get("PORT") ?? "8000"),
  isDev: Deno.env.get("APP_ENV") === "dev",
  refreshExpirationTime: parseInt(
    Deno.env.get("REFRESH_TOKEN_EXPIRATION_TIME") ??
      String(1000 * 60 * 60 * 24 * 30),
  ),
  jwtExpirationTime: parseInt(
    Deno.env.get("JWT_EXPIRATION_TIME") ?? String(1000 * 60 * 15),
  ),
};
