import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";
import db from "./models/index.model.js";
import User from "./models/user.model.js";
import { __dirname } from "./utils/utils.js";

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
            password: await bcrypt.hash("admin", salt),
            role: "admin",
			provider: "local",
        },
        {
            userId: "2",
            name: "Jane User",
            email: "user@example.com",
            password: await bcrypt.hash("user", salt),
            role: "user",
			provider: "local",
        },
    ];

    await User.bulkCreate(users);

    const data = await fs.readFile(
        path.join(__dirname, "seedData.sql"),
        "utf-8"
    );

    const queries = data
        .split(/;\s*\n/)
        .map((query) => query.trim())
        .filter((query) => query.length > 0 && !query.startsWith("--"));

    for (const query of queries) {
        await db.query(query);
    }
};

export default seedData;
