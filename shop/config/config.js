import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "sequelize";

dotenv.config({
    path: path.join(process.cwd(), `.env`),
});

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: "mysql",
        host: process.env.DB_HOST,
    }
);

const serverConfig = {
    FRONTEND_URL: process.env.FRONTEND_URL,
    SERVER_URL: process.env.SERVER_URL,
    PORT: process.env.PORT,
};

export { db, serverConfig };
