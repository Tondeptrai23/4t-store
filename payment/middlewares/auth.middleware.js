import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateToken = (timestamp, secretKey) => {
    // Combine timestamp with secret
    const data = `${timestamp}${secretKey}`;

    // Create HMAC using SHA-256
    return crypto.createHmac("sha256", secretKey).update(data).digest("hex");
};

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.PAYMENT_JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token" });
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const verifyConnection = async (req, res, next) => {
    try {
        const token = req.header("x-server-token")?.replace("Bearer ", "");

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }

        // Decode and verify the token
        try {
            const decoded = JSON.parse(Buffer.from(token, "base64").toString());
            const { timestamp, signature } = decoded;

            const tokenAge = Date.now() - timestamp;
            const maxAge = 5 * 60 * 1000;

            if (tokenAge > maxAge) {
                return res
                    .status(401)
                    .json({ success: false, message: "Token expired" });
            }

            const data = `${timestamp}`;
            const hmac = crypto.createHmac(
                "sha256",
                process.env.PAYMENT_CONNECTION_SECRET
            );
            const expectedSignature = hmac.update(data).digest("hex");

            const isValid = crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expectedSignature)
            );

            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token signature",
                });
            }

            next();
        } catch (decodeError) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token format" });
        }
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during verification",
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });
        }

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export { isAdmin, verifyConnection, verifyToken };
