import { Router } from "oak/mod.ts";
import health from "./health.ts";

const router = new Router();

router.use(health.routes());

export default router;
