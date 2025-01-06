import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/api/checkEmail", authController.checkEmail);

authRoute.get("/login", authController.loginView);
authRoute.get("/register", authController.registerView);

authRoute.post(
	"/login",
	passport.authenticate("local", { 
		failureRedirect: "/login?invalid-credentials=true",
	}),
	(_req, res) => {
		res.redirect("/"); 
	}
);

authRoute.post("/register", authController.register);
authRoute.get("/logout", authController.logout);
// authRoute.get("/status", authController.status);

export default authRoute;	
