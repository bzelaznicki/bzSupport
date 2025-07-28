import { Router } from "oak/mod.ts";
import tickets from "@routes/admin/tickets.ts";
import auth from "@routes/admin/auth.ts";

const adminRouter = new Router({ prefix: "/api/admin" });

adminRouter.use(auth.routes(), auth.allowedMethods());
adminRouter.use(tickets.routes(), tickets.allowedMethods());

export default adminRouter;
