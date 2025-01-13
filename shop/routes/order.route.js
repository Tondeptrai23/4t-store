import { Router } from "express";
import orderController from "../controllers/order.controller.js";

const orderRoute = Router();

orderRoute.get("/", orderController.getAll);
orderRoute.post("/create", orderController.create);
orderRoute.post("/payment", orderController.payment);

export default orderRoute;
