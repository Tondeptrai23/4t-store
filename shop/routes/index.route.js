import { Router } from "express";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import productRoute from "./product.route.js";

const router = Router();

router.use(userRoute);
router.use(authRoute);
router.use(productRoute);

export default router;
