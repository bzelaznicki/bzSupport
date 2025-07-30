import { JwtPayload, UserRole, verifyToken } from "@utils/jwt.ts";
import { unauthorized } from "@utils/httpError.ts";
import { Context } from "oak/mod.ts";

interface AuthOptions {
  roles?: UserRole[];
  tenantId?: string;
  issuer?: string;
}

export function withAuth(
  options: AuthOptions,
  handler: (ctx: Context & { state: { user: JwtPayload } }) => Promise<void>,
) {
  return async (ctx: Context) => {
    // Try to read from cookies first
    let token = await ctx.cookies.get("access_token");

    // Fallback: read from Authorization header
    if (!token) {
      const authHeader = ctx.request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // If no token, reject
    if (!token) {
      throw unauthorized("Missing access token");
    }

    // Verify
    const payload = await verifyToken(token, options.issuer || "bzSupport");

    // Role check
    if (options.roles && !options.roles.includes(payload.role)) {
      throw unauthorized("Insufficient permissions");
    }

    // Tenant check
    if (options.tenantId && payload.tenantId !== options.tenantId) {
      throw unauthorized("Tenant mismatch");
    }

    // Attach to state
    ctx.state.user = payload;
    await handler(ctx as Context & { state: { user: JwtPayload } });
  };
}
