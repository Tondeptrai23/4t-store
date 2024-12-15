import { Router } from "express";
import productController from "../controllers/product.controller.js";

const productRoute = Router();

productRoute.get("/product", productController.getAll);

export default productRoute;