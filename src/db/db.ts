import "https://deno.land/std@0.224.0/dotenv/load.ts";
import postgres from "postgres";
import { config } from "../config.ts";

const databaseUrl = Deno.env.get("DATABASE_URL") ??
  `postgres://${Deno.env.get("DB_USER") ?? "postgres"}:${
    Deno.env.get("DB_PASSWORD") ?? "postgres"
  }@${Deno.env.get("DB_HOST") ?? "localhost"}:${
    Deno.env.get("DB_PORT") ?? "5432"
  }/${Deno.env.get("DB_NAME") ?? "ticketing"}`;

export const sql = postgres(databaseUrl, {
  ssl: config.isDev ? false : "require",
});
const safeUrl = databaseUrl.replace(/:(.*?)@/, ":****@");
console.log(`Connected to DB at ${safeUrl}`);
