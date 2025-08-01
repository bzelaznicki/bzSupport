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

export function assertEmail(email: string | null | undefined) {
  if (!email) {
    throw badRequest("Email is required");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw badRequest("Invalid email format");
  }

  // Prevent email length attacks
  if (email.length > 254) {
    throw badRequest("Email too long");
  }
}

export function assertPassword(password: string | null | undefined) {
  if (!password) {
    throw badRequest("Password is required");
  }

  if (password.length < 8) {
    throw badRequest("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    throw badRequest("Password too long");
  }

  // Ensure password has some complexity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const complexityCount =
    [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (complexityCount < 3) {
    throw badRequest(
      "Password must contain at least 3 of: lowercase, uppercase, numbers, special characters",
    );
  }
}

export function sanitizeString(value: string, maxLength = 1000): string {
  if (!value) return "";

  // Remove null bytes and control characters except newlines and tabs
  // deno-lint-ignore no-control-regex
  const sanitized = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Truncate to max length
  return sanitized.slice(0, maxLength).trim();
}
