// Load environment variables
import "jsr:@std/dotenv/load";

import {
    ClientPostgreSQL,
    NessieConfig,
} from "https://raw.githubusercontent.com/halvardssm/deno-nessie/main/mod.ts";

const client = new ClientPostgreSQL({
    database: Deno.env.get("DB_NAME") ?? "ticketing",
    hostname: Deno.env.get("DB_HOST") ?? "localhost",
    port: Number(Deno.env.get("DB_PORT") ?? 5432),
    user: Deno.env.get("DB_USER") ?? "Bartek",
    password: Deno.env.get("DB_PASSWORD") ?? "postgres",
});

const config: NessieConfig = {
    client,
    migrationFolders: ["./migrations"], 
    seedFolders: ["./db/seeds"],
};

export default config;
