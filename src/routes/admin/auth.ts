import { Router } from "oak/mod.ts";
import { assertEmail, assertPassword } from "@utils/validators.ts";
import {
  invalidateRefreshToken,
  loginUser,
  refreshUserToken,
} from "@api/auth/auth.ts";
import { config } from "../../config.ts";
import { withRefreshAuth } from "@middleware/withRefreshAuth.ts";
import { rateLimit } from "@middleware/rateLimit.ts";

const router = new Router({ prefix: "/auth" });

router.post("/login", rateLimit(5, 15 * 60 * 1000), async (ctx) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  // Validate input
  assertEmail(email);
  assertPassword(password);

  const { accessToken, refreshToken, userResponse } = await loginUser(
    email,
    password,
  );

  ctx.response.status = 200;
  ctx.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: !config.isDev,
    sameSite: "strict",
    expires: new Date(Date.now() + config.jwtExpirationTime),
  });

  ctx.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: !config.isDev,
    sameSite: "strict",
    expires: new Date(Date.now() + config.refreshExpirationTime),
  });

  ctx.response.body = { userResponse };
});

router.post("/refresh", rateLimit(10, 5 * 60 * 1000), async (ctx) => {
  await withRefreshAuth(
    ctx as typeof ctx & { state: { refreshToken: string; userId: string } },
    async () => {
      const userId = ctx.state.userId;
      const oldToken = ctx.state.refreshToken;

      const { accessToken, refreshToken, userResponse } =
        await refreshUserToken(oldToken, userId);

      ctx.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: !config.isDev,
        sameSite: "strict",
        expires: new Date(Date.now() + config.jwtExpirationTime),
      });

      ctx.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: !config.isDev,
        sameSite: "strict",
        expires: new Date(Date.now() + config.refreshExpirationTime),
      });

      ctx.response.body = { userResponse };
    },
  );
});

router.post("/logout", async (ctx) => {
  await withRefreshAuth(
    ctx as typeof ctx & { state: { refreshToken: string; userId: string } },
    async () => {
      const refreshToken = ctx.state.refreshToken;
      await invalidateRefreshToken(refreshToken);

      ctx.cookies.delete("access_token");
      ctx.cookies.delete("refresh_token");
      ctx.response.status = 204;
    },
  );
});

export default router;
