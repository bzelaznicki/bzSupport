import { Router } from "oak/mod.ts";
import { badRequest } from "@utils/httpError.ts";
import {
  invalidateRefreshToken,
  loginUser,
  refreshUserToken,
} from "@api/auth/auth.ts";
import { config } from "../../config.ts";
import { withRefreshAuth } from "@middleware/withRefreshAuth.ts";

const router = new Router({ prefix: "/auth" });

router.post("/login", async (ctx) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  if (!email || !password) {
    throw badRequest("Email and password are required");
  }

  const { accessToken, refreshToken, userResponse } = await loginUser(
    email,
    password,
  );

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

router.post("/refresh", async (ctx) => {
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
        expires: new Date(Date.now() + 1000 * 60 * 15),
      });

      ctx.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: !config.isDev,
        sameSite: "strict",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
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
