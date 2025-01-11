import axios from "axios";
import { Router } from "express";
import adminRoute from "./admin.route.js";
import authRoute from "./auth.route.js";
import cartRoute from "./cart.route.js";
import cartRenderRoute from "./cartRender.route.js";
import productRoute from "./product.route.js";
import userRoute from "./user.route.js";

const router = Router();
router.use("/test", async (req, res) => {
    const isAuth = req.isAuthenticated();
    const response = await axios.get(
        `${process.env.PAYMENT_SERVER_URL}/balance`,
        {
            headers: {
                Authorization: `Bearer ${req.user.paymentToken}`,
            },
        }
    );

    res.send(response.data);
});
router.use(authRoute);
router.use(userRoute);
router.use(productRoute);
router.use("/admin", adminRoute);
router.use(cartRenderRoute);

router.use("/api/cart", cartRoute);

export default router;
