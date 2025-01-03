import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import passport from "passport";

import path from "path";
import { fileURLToPath } from "url";
import "./config/passport/local.js";

import connectSequelize from "connect-session-sequelize";
import { db } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";
import { deserializeHandler } from "./middlewares/auth.middleware.js";

const app = express();
const SequelizeStore = connectSequelize(session.Store);
const sessionStore = new SequelizeStore({
    db: db,
    tableName: "Session",
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
});
sessionStore.sync();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
    session({
        secret: "Vqj29kq&f93$s",
        store: sessionStore,
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 60 * 60 * 1000 },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(deserializeHandler);

app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    res.render("index", { body: "pages/landing", isLoggedIn });
});
app.use("/", router);

app.use(errorHandler);

export default app;
