import { Buffer } from "node:buffer";
import { crypto } from "https://deno.land/std@0.160.0/crypto/mod.ts";

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64");
}
