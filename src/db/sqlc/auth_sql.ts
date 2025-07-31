import { Sql } from "postgres";

export const getUserByEmailQuery = `-- name: GetUserByEmail :one
SELECT id, tenant_id, email, role, password_hash
FROM users
WHERE email = $1`;

export interface GetUserByEmailArgs {
  email: string;
}

export interface GetUserByEmailRow {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  passwordHash: string | null;
}

export async function getUserByEmail(
  sql: Sql,
  args: GetUserByEmailArgs,
): Promise<GetUserByEmailRow | null> {
  const rows = await sql.unsafe(getUserByEmailQuery, [args.email]).values();
  if (rows.length !== 1) {
    return null;
  }
  const row = rows[0];
  return {
    id: row[0],
    tenantId: row[1],
    email: row[2],
    role: row[3],
    passwordHash: row[4],
  };
}

export const getUserByIdQuery = `-- name: GetUserById :one
SELECT id, tenant_id, email, role
FROM users
WHERE id = $1`;

export interface GetUserByIdArgs {
  id: string;
}

export interface GetUserByIdRow {
  id: string;
  tenantId: string;
  email: string;
  role: string;
}

export async function getUserById(
  sql: Sql,
  args: GetUserByIdArgs,
): Promise<GetUserByIdRow | null> {
  const rows = await sql.unsafe(getUserByIdQuery, [args.id]).values();
  if (rows.length !== 1) {
    return null;
  }
  const row = rows[0];
  return {
    id: row[0],
    tenantId: row[1],
    email: row[2],
    role: row[3],
  };
}

export const createRefreshTokenQuery = `-- name: CreateRefreshToken :exec
INSERT INTO refresh_tokens (user_id, token, expires_at)
VALUES ($1, $2, $3)`;

export interface CreateRefreshTokenArgs {
  userId: string | null;
  token: string;
  expiresAt: Date;
}

export async function createRefreshToken(
  sql: Sql,
  args: CreateRefreshTokenArgs,
): Promise<void> {
  await sql.unsafe(createRefreshTokenQuery, [
    args.userId,
    args.token,
    args.expiresAt,
  ]);
}

export const getRefreshTokenQuery = `-- name: GetRefreshToken :one
SELECT id, user_id, token, expires_at, revoked_at, created_at
FROM refresh_tokens
WHERE token = $1`;

export interface GetRefreshTokenArgs {
  token: string;
}

export interface GetRefreshTokenRow {
  id: string;
  userId: string | null;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date | null;
}

export async function getRefreshToken(
  sql: Sql,
  args: GetRefreshTokenArgs,
): Promise<GetRefreshTokenRow | null> {
  const rows = await sql.unsafe(getRefreshTokenQuery, [args.token]).values();
  if (rows.length !== 1) {
    return null;
  }
  const row = rows[0];
  return {
    id: row[0],
    userId: row[1],
    token: row[2],
    expiresAt: row[3],
    revokedAt: row[4],
    createdAt: row[5],
  };
}

export const revokeRefreshTokenQuery = `-- name: RevokeRefreshToken :exec
UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = $1`;

export interface RevokeRefreshTokenArgs {
  token: string;
}

export async function revokeRefreshToken(
  sql: Sql,
  args: RevokeRefreshTokenArgs,
): Promise<void> {
  await sql.unsafe(revokeRefreshTokenQuery, [args.token]);
}

export const deleteUserRefreshTokensQuery =
  `-- name: DeleteUserRefreshTokens :exec
DELETE FROM refresh_tokens WHERE user_id = $1`;

export interface DeleteUserRefreshTokensArgs {
  userId: string | null;
}

export async function deleteUserRefreshTokens(
  sql: Sql,
  args: DeleteUserRefreshTokensArgs,
): Promise<void> {
  await sql.unsafe(deleteUserRefreshTokensQuery, [args.userId]);
}
