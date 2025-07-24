import { Pool } from "postgres/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL") ??
    `postgres://${Deno.env.get("DB_USER") ?? "postgres"}:${Deno.env.get("DB_PASSWORD") ?? "postgres"}@${Deno.env.get("DB_HOST") ?? "localhost"}:${Deno.env.get("DB_PORT") ?? "5432"}/${Deno.env.get("DB_NAME") ?? "ticketing"}`;

export const pool = new Pool(databaseUrl, 5, true);

export async function getClient() {
    return await pool.connect();
}
