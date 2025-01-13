import express from "express";
import expressLayouts from "express-ejs-layouts";
import adminDashboardController from "../controllers/admin.controller.js";
import adminCategoryController from "../controllers/adminCategory.controller.js";
import adminOrderController from "../controllers/adminOrder.controller.js";
import adminProductController from "../controllers/adminProduct.controller.js";
import adminUserController from "../controllers/adminUser.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAdmin);
router.use(expressLayouts);

router.get("/", adminDashboardController.dashboard);
router.get("/api/dashboard-data", adminDashboardController.getDashboardData);
router.get(
    "/api/payment/user-stats",
    adminDashboardController.getPaymentUserStats
);
router.get(
    "/api/payment/transaction-stats",
    adminDashboardController.getPaymentTransactionStats
);
router.get(
    "/api/payment/transactions",
    adminDashboardController.getTransactions
);

router.get("/products/detail/:id", adminProductController.showProductDetail);
router.get("/products", adminProductController.listProducts);
router.get("/products/create", adminProductController.showCreateForm);
router.post("/products/create", adminProductController.createProduct);
router.get("/products/edit/:id", adminProductController.showEditForm);
router.put("/products/:id", adminProductController.updateProduct);
router.delete("/products/:id", adminProductController.deleteProduct);
router.post("/products/bulk-delete", adminProductController.bulkDeleteProducts);

router.get("/categories/detail/:id", adminCategoryController.categoryDetail);
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

router.get("/orders/:orderId", adminOrderController.orderDetails);

router.get("/users/:id", adminUserController.getUserDetail);

export default router;
