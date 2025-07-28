import { Router } from "oak/mod.ts";
import tickets from "@routes/admin/tickets.ts";

const adminRouter = new Router({ prefix: "/api/admin" });

adminRouter.use(tickets.routes(), tickets.allowedMethods());

export default adminRouter;
