import { Context } from "oak/mod.ts";
import { unauthorized } from "@utils/httpError.ts";
import { validateRefreshToken } from "@api/auth/auth.ts";

export async function withRefreshAuth(
  ctx: Context & { state: { refreshToken: string; userId: string } },
  next: () => Promise<unknown>,
) {
  const token = await ctx.cookies.get("refresh_token");
  if (!token) throw unauthorized("Missing refresh token");

  const rt = await validateRefreshToken(token);
  if (!rt) throw unauthorized("Invalid or expired refresh token");

  ctx.state.refreshToken = token;
  ctx.state.userId = rt.userId ?? "";
  await next();
}
