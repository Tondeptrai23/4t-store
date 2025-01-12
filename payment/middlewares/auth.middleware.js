import jwt from "jsonwebtoken";
import User from "../models/user.js";

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

export { isAdmin, verifyToken };
