import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { serverConfig } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: serverConfig.FRONTEND_URL,
    })
);

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );

    next();
});

app.use("/api", router);

app.use(errorHandler);

export default app;
