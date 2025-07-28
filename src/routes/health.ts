import { Router } from "oak/mod.ts";

const router = new Router();
const startedAt = Date.now();

router.get("/health", (ctx) => {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);
  ctx.response.body = { status: "ok", uptime };
});

export default router;
