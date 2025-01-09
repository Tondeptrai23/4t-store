import bcrypt from "bcrypt";
import db from "./config/database.js";
import User from "./models/user.js";

async function seed() {
    try {
        await db.drop();
        await db.sync({ force: true });

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin", salt);
        const userPassword = await bcrypt.hash("user", salt);

        await User.create({
            username: "admin",
            password: adminPassword,
            isAdmin: true,
            balance: 0,
        });

        await User.create({
            username: "user1",
            password: userPassword,
            balance: 1000,
        });

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

seed();
