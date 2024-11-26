import User from "./models/user.model.js";

const seedData = async () => {
    await User.bulkCreate([
        {
            userId: 1,
            name: "John Doe",
        },
        {
            userId: 2,
            name: "Jane Smith",
        },
        {
            userId: 3,
            name: "Alice Johnson",
        },
        {
            userId: 4,
            name: "Bob Brown",
        },
    ]);
};
export default seedData;
