import express from "express";
import adminProductController from "../controllers/adminProduct.controller.js";

const router = express.Router();

router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);

export default router;
