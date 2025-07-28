import { verifyToken, JwtPayload, UserRole } from "@utils/jwt.ts";
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
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw unauthorized("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token, options.issuer || "bzSupport");

    // Role check
    if (options.roles && !options.roles.includes(payload.role)) {
      throw unauthorized("Insufficient permissions");
    }

    // Tenant check
    if (options.tenantId && payload.tenantId !== options.tenantId) {
      throw unauthorized("Tenant mismatch");
    }

    ctx.state.user = payload;
    await handler(ctx as Context & { state: { user: JwtPayload } });
  };
}
