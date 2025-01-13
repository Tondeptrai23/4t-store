import express from "express";
import expressLayouts from "express-ejs-layouts";
import adminCategoryController from "../controllers/adminCategory.controller.js";
import adminProductController from "../controllers/adminProduct.controller.js";
import adminUserController from "../controllers/adminUser.controller.js";

import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAdmin);
router.use(expressLayouts);

router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);
router.post("/products/create", adminProductController.createProduct);
router.get("/products/edit/:id", adminProductController.showEditForm);
router.put("/products/:id", adminProductController.updateProduct);
router.delete("/products/:id", adminProductController.deleteProduct);
router.post("/products/bulk-delete", adminProductController.bulkDeleteProducts);

router.get("/categories", adminCategoryController.listCategories);
router.get("/categories/create", adminCategoryController.showCreateForm);
router.post("/categories/create", adminCategoryController.createCategory);
router.get("/categories/edit/:id", adminCategoryController.showEditForm);
router.put("/categories/:id", adminCategoryController.updateCategory);
router.delete("/categories/:id", adminCategoryController.deleteCategory);
router.post(
    "/categories/bulk-delete",
    adminCategoryController.bulkDeleteCategories
);

router.get("/users", adminUserController.listUsers);
router.get("/users/create", adminUserController.showCreateForm);
router.post("/users/create", adminUserController.createUser);
router.get("/users/edit/:id", adminUserController.showEditForm);
router.put("/users/:id", adminUserController.updateUser);
router.delete("/users/:id", adminUserController.deleteUser);
router.post(
    "/users/bulk-delete",
    adminUserController.bulkDeleteUsers
);
router.get("/users/deleted", adminUserController.listDeletedUsers); 

export default router;
