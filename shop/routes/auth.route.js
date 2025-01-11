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
		successRedirect: "/",
        failureRedirect: "/login?invalid-credentials=true",
    }),
    authController.postLogin
);

authRoute.post("/register", authController.register);
authRoute.get("/logout", authController.logout);
// authRoute.get("/status", authController.status);

authRoute.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);
authRoute.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login?google-auth-failed=true",
	}),
	authController.googleCallback
);

export default authRoute;
