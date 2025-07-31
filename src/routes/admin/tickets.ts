import { Router } from "oak/mod.ts";
import { createTicket, listTickets } from "@api/tickets/tickets.ts";
import { withAuth } from "@middleware/withAuth.ts";

const router = new Router({ prefix: "/tickets" });
const TENANT_ID = "0da94e5b-9280-49c7-80ef-dbd54e8f16c7"; //TODO get from login context

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
