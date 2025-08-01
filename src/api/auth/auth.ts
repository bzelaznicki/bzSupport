import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { signToken } from "@utils/jwt.ts";
import {
  createRefreshToken,
  CreateRefreshTokenArgs,
  getRefreshToken,
  getUserByEmail,
  getUserById,
  revokeRefreshToken,
} from "@db/sqlc/auth_sql.ts";
import { unauthorized } from "@utils/httpError.ts";
import { sql } from "@db/db.ts";
import { generateRefreshToken } from "@utils/refreshTokens.ts";
import { UserResponse } from "../../types/user.ts";
import { config } from "../../config.ts";

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(sql, { email });
  if (!user || !user.passwordHash) {
    throw unauthorized("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw unauthorized("Invalid credentials");
  }

  const accessToken = await signToken(
    user.id,
    user.role as "admin" | "agent" | "user",
    user.tenantId,
  );

  const refreshToken = await issueRefreshToken(user.id);

  const userResponse: UserResponse = {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role as "admin" | "agent" | "user",
  };

  return { accessToken, refreshToken, userResponse };
}

export async function issueRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + config.refreshExpirationTime);

  const args: CreateRefreshTokenArgs = {
    userId,
    token,
    expiresAt,
  };

  await createRefreshToken(sql, args);

  return token;
}

export async function validateRefreshToken(token: string) {
  const rt = await getRefreshToken(sql, { token });

  if (rt === null) return null;

  if (rt.revokedAt !== null || new Date(rt.expiresAt) < new Date()) return null;

  return rt;
}

export async function refreshUserToken(token: string, userId: string) {
  await invalidateRefreshToken(token);
  const user = await getUserById(sql, { id: userId });

  if (!user) throw unauthorized("User not found");

  const accessToken = await signToken(
    user.id,
    user.role as "admin" | "agent" | "user",
    user.tenantId,
  );

  const refreshToken = await issueRefreshToken(user.id);

  const userResponse: UserResponse = {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role as "admin" | "agent" | "user",
  };

  return { accessToken, refreshToken, userResponse };
}

export async function invalidateRefreshToken(token: string) {
  await revokeRefreshToken(sql, { token });
}
