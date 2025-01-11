import dotenv from "dotenv";
import { dirname } from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const db = new Sequelize(
    process.env.PAYMENT_DB_NAME,
    process.env.PAYMENT_DB_USER,
    process.env.PAYMENT_DB_PASS,
    {
        host: process.env.PAYMENT_DB_HOST,
        dialect: "mysql",
    }
);

export default db;
