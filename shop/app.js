import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import passport from "passport";

import "./config/passport/local.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  // TODO: Change the secret to something more secure
  secret: "secret",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.use(errorHandler);

export default app;
