import { verifyToken } from "@utils/jwt.ts";
import { unauthorized } from "@utils/httpError.ts";

export async function authMiddleware(
  req: Request,
  next: (req: Request & { user?: unknown }) => Promise<Response>,
): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw unauthorized("Missing or invalid Authorization header");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await verifyToken(token, "my-app");
    const reqWithUser = Object.assign(req, { user: payload });
    return await next(reqWithUser);
  } catch {
    throw unauthorized("Invalid or expired token");
  }
}
