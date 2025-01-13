import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import orderController from "../controllers/order.controller.js";

const cartRenderRoute = Router();

cartRenderRoute.get("/cart", cartController.getCart);
cartRenderRoute.get("/orders", orderController.getByUserId);

export default cartRenderRoute;
