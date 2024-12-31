import fs from "fs/promises";
import db from "./models/index.model.js";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";

db.sync({ force: true })
    .then(async (res) => {
        console.log("Database connected");
        await seedData();
    })
    .catch((err) => console.log(err));

const seedData = async () => {
    const salt = await bcrypt.genSalt(10);
    const users = [
        {
            userId: "1",
            name: "John Admin",
            email: "admin@example.com",
            password: await bcrypt.hash("admin123", salt),
            role: "admin",
        },
        {
            userId: "2",
            name: "Jane User",
            email: "user@example.com",
            password: await bcrypt.hash("user123", salt),
            role: "user",
        },
    ];

    await User.bulkCreate(users);

    const data = await fs.readFile("./seedData.sql", "utf-8");

    const queries = data
        .split(/;\s*\n/)
        .map((query) => query.trim())
        .filter((query) => query.length > 0 && !query.startsWith("--"));

    for (const query of queries) {
        await db.query(query);
    }
};

export default seedData;
