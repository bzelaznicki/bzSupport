import { Router } from "oak/mod.ts";
import { badRequest } from "@utils/httpError.ts";
import { loginUser } from "@api/auth/auth.ts";
import { config } from "../../config.ts";

const router = new Router({ prefix: "/auth" });

router.post("/login", async (ctx) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  if (!email || !password) {
    throw badRequest("Email and password are required");
  }

  const { accessToken, refreshToken, userResponse } = await loginUser(email, password);

  ctx.response.status = 200;
ctx.cookies.set("access_token", accessToken, {
  httpOnly: true,
  secure: !config.isDev,
  sameSite: "strict",
  expires: new Date(Date.now() + 1000 * 60 * 15),
});

ctx.cookies.set("refresh_token", refreshToken, {
  httpOnly: true,
  secure: !config.isDev,
  sameSite: "strict",
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), 
});

  ctx.response.body = { userResponse };
});

export default router;
