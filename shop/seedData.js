import fs from "fs/promises";
import db from "./models/index.model.js";
import User from "./models/user.model.js";

db.sync({ force: true })
    .then(async (res) => {
        console.log("Database connected");
        await seedData();
    })
    .catch((err) => console.log(err));

const seedData = async () => {
    const users = [
        {
            userId: "1",
            name: "John Admin",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
        },
        {
            userId: "2",
            name: "Jane User",
            email: "user@example.com",
            password: "user123",
            role: "user",
        },
    ];

    await User.bulkCreate(users);

    const data = await fs.readFile("./seedData.sql", "utf-8");

    await db.query(data.replace(/[\r\n]/g, ""));
};

export default seedData;
