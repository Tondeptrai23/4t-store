import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
		try {
			const insertedUser = await User.create(user);
			return insertedUser; 
		}
		catch (error) {
			throw new Error(error);
		}
    }
}

export default new UserService();
