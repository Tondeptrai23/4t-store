import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/test", verifyToken, (req, res) => {
    res.send("Test");
});

export default router;
