import { validate } from "https://deno.land/std/uuid/mod.ts";
import { badRequest } from "./httpError.ts";

export function assertUUID(value: string | null | undefined, field = "id") {
  if (!value || !validate(value)) {
    throw badRequest(`${field} must be a valid UUID`);
  }
}

export function assertRequired(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    throw badRequest(`${field} is required`);
  }
}
