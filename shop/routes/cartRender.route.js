import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const cartRoute = Router();

// cartRoute.get("/cart", cartController.getAll);
// cartRoute.get("/cart/db", cartController.getAllDb);
// cartRoute.post("/cart", cartController.create);
// cartRoute.put("/cart/:id", cartController.update);
// cartRoute.delete("/cart/:id", cartController.delete);

export default cartRoute;