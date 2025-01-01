import { Router } from "express";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";
import cartRoute from "./cart.route.js";
import cartRenderRoute from "./cartRender.route.js";

const router = Router();

router.use(userRoute);
router.use(productRoute);
router.use(cartRenderRoute);

router.use('/api', cartRoute);

export default router;
