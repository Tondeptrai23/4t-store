import { Router } from "express";
import userController from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.get("/users", userController.getAll);

userRoute.get("/users/db", userController.getAllDb);

export default userRoute;
