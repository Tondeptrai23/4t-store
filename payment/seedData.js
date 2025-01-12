import bcrypt from "bcrypt";
import db from "./config/database.js";
import Transaction from "./models/transaction.js";
import User from "./models/user.js";

async function seedTransactions() {
    try {
        const admin = await User.findOne({ where: { username: "admin" } });
        const user = await User.findOne({ where: { username: "user1" } });

        if (!admin || !user) {
            throw new Error("Users must be seeded first");
        }

        // Create sample transactions
        const transactions = [
            {
                fromUserId: user.id,
                toUserId: admin.id,
                amount: 1197000,
                status: "completed",
                message: "Payment for order ORD001",
                orderId: "ORD001",
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
            },
            {
                fromUserId: user.id,
                toUserId: admin.id,
                amount: 899000,
                status: "completed",
                message: "Payment for order ORD002",
                orderId: "ORD002",
                createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
            },
            {
                fromUserId: user.id,
                toUserId: admin.id,
                amount: 1598000,
                status: "completed",
                message: "Payment for order ORD003",
                orderId: "ORD003",
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
            },
            {
                fromUserId: user.id,
                toUserId: admin.id,
                amount: 2097000,
                status: "pending",
                message: "Payment for order ORD004",
                orderId: "ORD004",
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                fromUserId: user.id,
                toUserId: admin.id,
                amount: 1299000,
                status: "pending",
                message: "Payment for order ORD005",
                orderId: "ORD005",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        // Bulk create transactions
        await Transaction.bulkCreate(transactions);

        console.log("Transactions seeded successfully");
    } catch (error) {
        console.error("Error seeding transactions:", error);
        throw error;
    }
}

// Update the main seed function
async function seed() {
    try {
        await db.drop();
        await db.sync({ force: true });

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin", salt);
        const userPassword = await bcrypt.hash("user", salt);

        await User.create({
            id: 1,
            username: "admin",
            password: adminPassword,
            isAdmin: true,
            balance: 0,
        });

        await User.create({
            id: 2,
            username: "user1",
            password: userPassword,
            balance: 100000,
        });

        // Add transaction seeding
        await seedTransactions();

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();
