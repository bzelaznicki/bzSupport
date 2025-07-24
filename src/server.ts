import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { Application } from "oak/mod.ts";
import router from "./routes/index.ts";

const app = new Application();


app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = Number(Deno.env.get("PORT") ?? 8000);
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
