import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/auth/login", passport.authenticate("local"), authController.login);
authRoute.post("/auth/logout", authController.logout);
authRoute.get("/auth/status", authController.status);

export default authRoute;