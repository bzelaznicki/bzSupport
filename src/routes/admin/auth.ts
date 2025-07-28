import { Router } from "oak/mod.ts";
import { badRequest } from "@utils/httpError.ts";
import { loginUser } from "@api/auth/auth.ts";

const router = new Router({ prefix: "/auth" });

router.post("/login", async (ctx) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  if (!email || !password) {
    throw badRequest("Email and password are required");
  }

  const token = await loginUser(email, password);

  ctx.response.status = 200;
  ctx.response.body = { token };
});

export default router;
