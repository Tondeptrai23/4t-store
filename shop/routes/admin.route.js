import express from "express";
import expressLayouts from "express-ejs-layouts";
import adminProductController from "../controllers/adminProduct.controller.js";
import adminCategoryController from "../controllers/adminCategory.controller.js";

const router = express.Router();

router.use(expressLayouts);

router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);
router.post("/products/create", adminProductController.createProduct);
router.get("/products/edit/:id", adminProductController.showEditForm);
router.put("/products/:id", adminProductController.updateProduct);
router.delete("/products/:id", adminProductController.deleteProduct);
router.post("/products/bulk-delete", adminProductController.bulkDeleteProducts);

router.get('/categories', adminCategoryController.listCategories);
router.get("/categories/create", adminCategoryController.showCreateForm);
router.post('/categories/create', adminCategoryController.createCategory);

export default router;
