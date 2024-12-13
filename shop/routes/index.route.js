import { Router } from "express";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";

const router = Router();

router.use(userRoute);
router.use(authRoute);

export default router;
