import User from "../models/user.model.js";

class UserService {
    async getAll() {
        return await User.findAll();
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

		async create(user) {
				return await User.create(user);
		}
}

export default new UserService();
