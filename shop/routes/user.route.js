import { Router } from "express";
import userController from "../public/assets/user.controller.js";

const userRoute = Router();

userRoute.get("/profile", userController.getProfile);

userRoute.put("/profile", userController.updateProfile);
export default userRoute;
