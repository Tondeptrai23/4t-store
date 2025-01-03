import { Router } from "express";
import adminRoute from "./admin.route.js";
import authRoute from "./auth.route.js";
import productRoute from "./product.route.js";
import userRoute from "./user.route.js";

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(productRoute);
router.use("/admin", adminRoute);

export default router;
