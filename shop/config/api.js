import axios from "axios";
import dotenv from "dotenv";
import https from "https";
dotenv.config();

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const api = axios.create({
    baseURL: process.env.PAYMENT_SERVER_URL,
    httpsAgent: httpsAgent,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export default api;
