import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import transactionController from "../controllers/transaction.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/transfer", verifyToken, transactionController.transfer);

router.get(
    "/transactions",
    verifyToken,
    transactionController.getTransactionHistory
);

router.get(
    "/admin/balance",
    verifyToken,
    transactionController.getAdminBalance
);

export default router;
