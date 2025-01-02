import { Router } from "express";
import cartController from "../controllers/cart.controller.js";


const cartRoute = Router();

cartRoute.get("/", cartController.getCart);
cartRoute.post("/add", cartController.addToCart);

export default cartRoute;
