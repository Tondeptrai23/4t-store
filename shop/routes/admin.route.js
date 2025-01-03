import express from "express";
import expressLayouts from "express-ejs-layouts";
import adminProductController from "../controllers/adminProduct.controller.js";

const router = express.Router();

router.use(expressLayouts);

router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);

export default router;
