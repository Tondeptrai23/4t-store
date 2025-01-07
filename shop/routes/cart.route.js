import { Router } from "express";
import cartController from "../controllers/cart.controller.js";


const cartRoute = Router();

cartRoute.get("/", cartController.getCartItems);

cartRoute.post("/add", cartController.addToCart);

cartRoute.post("/delete", cartController.deleteCartItem); 

cartRoute.post("/update", cartController.updateCartItem);

cartRoute.post("/sync", cartController.syncCart);

export default cartRoute;
