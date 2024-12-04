import bodyParser from "body-parser";
import express from "express";

import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/api", router);

app.use(errorHandler);

export default app;
