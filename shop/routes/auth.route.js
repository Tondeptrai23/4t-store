import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.get("/login", authController.loginView);
authRoute.get("/register", authController.registerView);

authRoute.post(
	"/login",
	passport.authenticate("local"),
	(_req, res) => {
		res.redirect("/");
	}
);
authRoute.post("/register", authController.register);
authRoute.post("/logout", authController.logout);
// authRoute.get("/status", authController.status);

export default authRoute;