import dotenv from "dotenv";
import { Sequelize } from "sequelize";

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
