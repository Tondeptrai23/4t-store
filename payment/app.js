import dotenv from "dotenv";
import express from "express";
import db from "./config/database.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import router from "./routes/index.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

db.sync();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
