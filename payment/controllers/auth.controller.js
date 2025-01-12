import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
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
    }

    async register(req, res) {
        const { username, password } = req.body;

        const DEFAULT_BALANCE = 500000;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
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
    }
}

export default new AuthController();
