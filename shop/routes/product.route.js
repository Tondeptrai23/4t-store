import { Router } from "express";
import productController from "../controllers/product.controller.js";

const productRoute = Router();

productRoute.get("/product", productController.getAll);
productRoute.get("/products", productController.getProducts);
productRoute.get("/products/:id", productController.getById);

export default productRoute;