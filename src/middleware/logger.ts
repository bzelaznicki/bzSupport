import { Context } from "oak/mod.ts";

export default async function logger(
  ctx: Context,
  next: () => Promise<unknown>,
) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
}
