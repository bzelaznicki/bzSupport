import { Router } from "oak/mod.ts";
import health from "@routes/health.ts";
import adminRouter from "@routes/admin/index.ts";
import publicRouter from "@routes/public/index.ts";

const router = new Router();

router.use(health.routes(), health.allowedMethods());
router.use(adminRouter.routes(), adminRouter.allowedMethods());
router.use(publicRouter.routes(), publicRouter.allowedMethods());

export default router;
