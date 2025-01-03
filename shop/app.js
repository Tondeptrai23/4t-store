import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import passport from "passport";

import "./config/passport/local.js";
import path from "path";
import { fileURLToPath } from 'url';

import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/utils', express.static(path.join(__dirname, 'utils')));
app.set("view engine", "ejs");

app.use(session({
	secret: "Vqj29kq&f93$s",
	saveUninitialized: false,
	resave: false,
	cookie: { maxAge: 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));

console.log("Views Directory:", app.get("views"));

app.get('/', (req, res) => {
	const isLoggedIn = req.isAuthenticated();
	res.render('index', { body: 'pages/landing', isLoggedIn });
});
app.use("/", router);

app.use(errorHandler);

export default app;
