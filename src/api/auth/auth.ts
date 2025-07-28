import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { signToken } from "@utils/jwt.ts";
import { getUserByEmail } from "@db/sqlc/auth_sql.ts";
import { unauthorized } from "@utils/httpError.ts";
import { sql } from "@db/db.ts";

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(sql, { email });
  if (!user || !user.passwordHash) {
    throw unauthorized("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw unauthorized("Invalid credentials");
  }

  return await signToken(
    user.id,
    user.role as "admin" | "agent" | "user",
    user.tenantId,
  );
}
