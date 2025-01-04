import { Router } from "express";
import authRoute from "./auth.route.js";
import cartRoute from "./cart.route.js";
import cartRenderRoute from "./cartRender.route.js";
import productRoute from "./product.route.js";
import userRoute from "./user.route.js";

const router = Router();

router.use(authRoute);
router.use(userRoute);
router.use(productRoute);
router.use(cartRenderRoute);

router.use("/api/cart", cartRoute);

export default router;
