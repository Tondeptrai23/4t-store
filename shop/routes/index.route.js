import { Router } from "express";
import adminRoute from "./admin.route.js";
import authRoute from "./auth.route.js";
import cartRoute from "./cart.route.js";
import cartRenderRoute from "./cartRender.route.js";
import productRoute from "./product.route.js";
import userRoute from "./user.route.js";
import allCategoryRoute from "./allCategory.route.js"

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(productRoute);
router.use("/admin", adminRoute);
router.use(cartRenderRoute);
router.use(allCategoryRoute);

router.use("/api/cart", cartRoute);

export default router;
