import { Context, Next } from "oak/mod.ts";
import { tooManyRequests } from "@utils/httpError.ts";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limiting store
// In production, use Redis or similar persistent store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(maxRequests = 5, windowMs = 15 * 60 * 1000) {
  return async (ctx: Context, next: Next) => {
    const clientIp = ctx.request.ip;
    const now = Date.now();
    const key = `${clientIp}:${ctx.request.url.pathname}`;

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      await next();
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      ctx.response.headers.set("Retry-After", retryAfter.toString());
      throw tooManyRequests("Too many requests, please try again later");
    }

    entry.count++;
    await next();
  };
}
