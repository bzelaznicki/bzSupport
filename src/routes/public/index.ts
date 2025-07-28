import { Router } from "oak/mod.ts";

const publicRouter = new Router({ prefix: "/api/v1" });

publicRouter.get("/status", (ctx) => {
  ctx.response.body = { api: "v1", status: "ok" };
});

export default publicRouter;
