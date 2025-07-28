import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { Application } from "oak/mod.ts";
import router from "./routes/index.ts";

const app = new Application();

// --- Global error handler ---
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    const status = (err as { status?: number }).status ?? 500;
    const message = (err as { message?: string }).message ?? "Internal Server Error";
    ctx.response.status = status;
    ctx.response.body = { error: message };
    ctx.response.type = "json";
  }
});

// --- Request logging ---
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// --- Routes ---
app.use(router.routes());
app.use(router.allowedMethods());

// --- Start server ---
const PORT = Number(Deno.env.get("PORT") ?? 8000);
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
