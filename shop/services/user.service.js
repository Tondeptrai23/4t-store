import User from "../models/user.model.js";

class UserService {
    getAll() {
        return [
            {
                userId: "123",
                name: "abc",
            },
            {
                userId: "234",
                name: "abc",
            },
            {
                userId: "345",
                name: "abc",
            },
        ];
    }

    async getAllInDb() {
        return await User.findAll();
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findById(id) {
        return await User.findByPk(id);
    }
}

export default new UserService();
