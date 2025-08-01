import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { unauthorized } from "./httpError.ts";
import { config } from "../config.ts";

export type UserRole = "admin" | "agent" | "user";

export interface JwtPayload {
  userId: string;
  tenantId?: string;
  role: UserRole;
  iss?: string;
  exp?: number;
}

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(config.jwtSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return cachedKey;
}

export async function signToken(
  userId: string,
  role: UserRole,
  tenantId?: string,
  issuer = "bzSupport",
): Promise<string> {
  const key = await getKey();
  const payload: JwtPayload = {
    userId,
    tenantId,
    role,
    iss: issuer,
    exp: getNumericDate(60 * 60),
  };
  return await create(
    { alg: "HS256", typ: "JWT" },
    payload as unknown as Record<string, unknown>,
    key,
  );
}

export async function verifyToken(
  token: string,
  expectedIssuer?: string,
): Promise<JwtPayload> {
  const key = await getKey();
  const rawPayload = await verify(token, key) as unknown;

  function isJwtPayload(obj: unknown): obj is JwtPayload {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "userId" in obj &&
      "role" in obj
    );
  }

  if (!isJwtPayload(rawPayload)) {
    throw unauthorized("Invalid token payload");
  }

  if (expectedIssuer && rawPayload.iss !== expectedIssuer) {
    throw unauthorized("Invalid token issuer");
  }

  return rawPayload;
}
