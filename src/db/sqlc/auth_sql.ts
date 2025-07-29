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
