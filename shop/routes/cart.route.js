import { Router } from "express";
import cartController from "../controllers/cart.controller.js";


const cartRoute = Router();

cartRoute.get("/", cartController.getCartItems);

cartRoute.post("/add", cartController.addToCart);

cartRoute.post("/delete", cartController.deleteCartItem); 

export default cartRoute;
