import { Router } from "express";
import passport from "passport";
import CartItemService from "../services/cart.service.js";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.get("/login", authController.loginView);
authRoute.get("/register", authController.registerView);

authRoute.post(
	"/login",
	passport.authenticate("local"), authController.postLogin
);
authRoute.post("/register", authController.register);
authRoute.post("/logout", authController.logout);
// authRoute.get("/status", authController.status);

export default authRoute;