import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";
import { AuthenticationError } from "../utils/error.js";

const authRoute = Router();

authRoute.get("/login", authController.loginView);
authRoute.get("/register", authController.registerView);

authRoute.post(
	"/login", 
	passport.authenticate("local"), 
	authController.loginErrorHandle
);
authRoute.post("/register", authController.register);
authRoute.get("/logout", authController.logout);
// authRoute.get("/status", authController.status);

export default authRoute;
