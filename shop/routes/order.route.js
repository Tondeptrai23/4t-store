import {Router} from "express";
import orderController from "../controllers/order.controller.js";

const orderRoute = Router();

orderRoute.post("/create", orderController.create);
orderRoute.get("/get", orderController.getAll);

export default orderRoute;