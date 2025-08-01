import { Context, Next } from "oak/mod.ts";
import { badRequest } from "@utils/httpError.ts";

const ALLOWED_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
];

export function validateContentType(allowedTypes = ALLOWED_CONTENT_TYPES) {
  return async (ctx: Context, next: Next) => {
    // Only validate for requests with body
    if (["POST", "PUT", "PATCH"].includes(ctx.request.method)) {
      const contentType = ctx.request.headers.get("content-type");

      if (contentType) {
        // Extract main content type (ignore charset, boundary, etc.)
        const mainType = contentType.split(";")[0].trim().toLowerCase();

        if (!allowedTypes.includes(mainType)) {
          throw badRequest(`Unsupported content type: ${mainType}`);
        }
      }
    }

    await next();
  };
}
