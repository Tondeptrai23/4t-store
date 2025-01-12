import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import transactionController from "../controllers/transaction.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/transfer", verifyToken, transactionController.transfer);

router.get("/balance", verifyToken, transactionController.getBalance);

router.get(
    "/transactions",
    verifyToken,
    transactionController.getTransactionHistory
);

router.get(
    "/admin/stats/users",
    verifyToken,
    isAdmin,
    transactionController.getUserStatistics
);

router.get(
    "/admin/stats/transactions",
    verifyToken,
    isAdmin,
    transactionController.getTransactionStatistics
);

export default router;
