import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const cartRenderRoute = Router();

cartRenderRoute.get("/cart", cartController.getCart);

export default cartRenderRoute;
