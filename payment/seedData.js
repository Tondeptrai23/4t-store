import sequelize from "../config/database.js";
import User from "../models/User.js";

async function seed() {
    try {
        await sequelize.drop();
        await sequelize.sync({ force: true });

        await User.create({
            username: "admin",
            password: "admin123",
            isAdmin: true,
            balance: 0,
        });

        await User.create({
            username: "user1",
            password: "user123",
            balance: 1000,
        });

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

export default seed;
