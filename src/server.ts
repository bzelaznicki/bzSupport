import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { Application } from "oak/mod.ts";
import router from "./routes/index.ts";
import errorHandler from "@middleware/errorHandler.ts";
import logger from "@middleware/logger.ts";

const app = new Application();

// --- Middleware ---
app.use(errorHandler);
app.use(logger);

// --- Routes ---
app.use(router.routes());
app.use(router.allowedMethods());

// --- Start server ---
const PORT = Number(Deno.env.get("PORT") ?? 8000);
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
