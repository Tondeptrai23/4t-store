import bodyParser from "body-parser";
import express from "express";
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
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

console.log("Views Directory:", app.get("views"));

app.get('/', (req, res) => {
    res.render('index', { body: 'pages/landing' });
    
});
app.use("/", router);
// app.use("/api", router);

app.use(errorHandler);

export default app;
