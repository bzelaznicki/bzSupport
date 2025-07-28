import { Context } from "oak/mod.ts";
import { HttpError } from "@utils/httpError.ts";

export default async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next();
  } catch (err) {
    let status = 500;
    let message = "Internal Server Error";

    if (err instanceof HttpError) {
      status = err.status;
      message = err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    console.error(JSON.stringify({
      level: "error",
      status,
      message,
      method: ctx.request.method,
      url: ctx.request.url.href,
      timestamp: new Date().toISOString(),
      stack: err instanceof Error ? err.stack : undefined,
    }));

    ctx.response.status = status;
    ctx.response.body = { error: message };
    ctx.response.type = "json";
  }
}
