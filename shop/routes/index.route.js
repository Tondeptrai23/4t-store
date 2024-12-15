import { Router } from "express";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";

const router = Router();

router.use(userRoute);
router.use(productRoute);

export default router;
