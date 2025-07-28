import { validate } from "https://deno.land/std/uuid/mod.ts";
import { badRequest } from "./httpError.ts";

export function assertUUID(value: string, field = "id") {
  if (!validate(value)) throw badRequest(`${field} must be a valid UUID`);
}
