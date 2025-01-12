import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import db from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import router from "./routes/index.route.js";

dotenv.config();

const app = express();

const sslOptions = {
    key: fs.readFileSync(path.join(process.cwd(), "payment/ssl", "key.pem")),
    cert: fs.readFileSync(path.join(process.cwd(), "payment/ssl", "cert.pem")),
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.use(errorHandler);

const HTTPS_PORT = process.env.PAYMENT_PORT || 3001;

const httpsServer = https.createServer(sslOptions, app);

db.sync();

httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});
