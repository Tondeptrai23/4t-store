import axios from "axios";
import crypto from "crypto";
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

export function generateToken() {
    const timestamp = Date.now();
    const data = `${timestamp}`;
    const hmac = crypto.createHmac(
        "sha256",
        process.env.PAYMENT_CONNECTION_SECRET
    );
    const signature = hmac.update(data).digest("hex");

    const token = Buffer.from(
        JSON.stringify({
            timestamp,
            signature,
        })
    ).toString("base64");

    return token;
}

export default api;
