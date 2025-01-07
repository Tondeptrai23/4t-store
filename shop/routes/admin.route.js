import express from "express";
import expressLayouts from "express-ejs-layouts";
import adminProductController from "../controllers/adminProduct.controller.js";

const router = express.Router();

router.use(expressLayouts);

router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);
router.post("/products/create", adminProductController.createProduct);
router.get("/products/edit/:id", adminProductController.showEditForm);
router.put("/products/:id", adminProductController.updateProduct);
router.delete("/products/:id", adminProductController.deleteProduct);
router.post("/products/bulk-delete", adminProductController.bulkDeleteProducts);

export default router;
