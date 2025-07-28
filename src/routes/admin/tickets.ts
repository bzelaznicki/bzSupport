import { Router } from "oak/mod.ts";
import { createTicket, listTickets } from "@api/tickets/tickets.ts";
import { withAuth } from "@middleware/withAuth.ts";

const router = new Router({ prefix: "/tickets" });
const TENANT_ID = "048ec673-12ee-498b-b1b5-fe6a1063ecbd";

router.get(
  "/",
  withAuth({ roles: ["admin", "agent"], tenantId: TENANT_ID }, async (ctx) => {
    ctx.response.body = await listTickets(TENANT_ID);
  }),
);

router.post(
  "/",
  withAuth({ roles: ["admin"], tenantId: TENANT_ID }, async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    const ticket = await createTicket(TENANT_ID, body);
    ctx.response.status = 201;
    ctx.response.body = ticket;
  }),
);

export default router;
