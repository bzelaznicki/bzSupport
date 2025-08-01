import { Context, Next } from "oak/mod.ts";
import { config } from "../config.ts";

export async function securityHeaders(ctx: Context, next: Next) {
  // Set security headers
  ctx.response.headers.set("X-Content-Type-Options", "nosniff");
  ctx.response.headers.set("X-Frame-Options", "DENY");
  ctx.response.headers.set("X-XSS-Protection", "1; mode=block");
  ctx.response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  // Content Security Policy - restrictive but functional for API
  ctx.response.headers.set(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none';",
  );

  // HSTS only in production
  if (!config.isDev) {
    ctx.response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  await next();
}
