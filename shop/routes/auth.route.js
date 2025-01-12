import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/api/checkEmail", authController.checkEmail);

authRoute.get(
	"/login",
	(req, _res, next) => {
		req.session.redirectTo = req.headers.referer || "/";
		next();
	},
	authController.loginView
);
authRoute.get("/register", authController.registerView);

authRoute.post("/api/afterLogin", authController.afterLogin);

authRoute.post(
	"/login",
	// passport.authenticate("local", {
	// 	failureRedirect: "/login?invalid-credentials=true",
	// }),
	// authController.successRedirect

	authController.localAuthenticate
);

authRoute.post("/register", authController.register);
authRoute.get("/logout", authController.logout);
// authRoute.get("/status", authController.status);

authRoute.get(
	"/auth/google",
	// passport.authenticate("google", {
	// 	scope: ["profile", "email"],
	// })
	authController.oauth2Authenticator("google", { scope: ["profile", "email"] })
);
authRoute.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login?google-auth-failed=true",
	}),
	// authController.successRedirect
	authController.oauth2Callback()
);

authRoute.get(
	'/auth/facebook',
	// passport.authenticate('facebook', { session: false, scope: ['email'] })
	authController.oauth2Authenticator('facebook', { scope: ['email'] })
);

authRoute.get(
	'/auth/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login?facebook-auth-failed=true',
	}),
	// authController.successRedirect
	authController.oauth2Callback()
);

export default authRoute;
