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
			await User.create(user);
		}
		catch (error) {
			if (error instanceof Sequelize.UniqueConstraintError) {
				throw new Error("Email đã tồn tại.");
			}
			throw new Error(error);
		}
        return user; 
    }
}

export default new UserService();
