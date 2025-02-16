import jwt from "jsonwebtoken";
import User from "../models/user.js";

class AuthController {
    async login(req, res) {
        try {
            const { username } = req.body;

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.PAYMENT_JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async register(req, res) {
        try {
            const { username } = req.body;

            const DEFAULT_BALANCE = 50000000;

            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username already exists" });
            }

            const user = await User.create({
                username,
                balance: DEFAULT_BALANCE,
                isAdmin: false,
            });

            const token = jwt.sign(
                { id: user.id, username: user.username, isAdmin: user.isAdmin },
                process.env.PAYMENT_JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default new AuthController();
