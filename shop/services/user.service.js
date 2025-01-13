import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ModelError } from "../utils/errors.js";

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
		const userExists = await this.findByEmail(user.email);
		if (userExists) {
			throw new ModelError("User already exists");
		}
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		const insertedUser = await User.create(user);
		return insertedUser;
	}

	async update(userId, user) {
		const updatedUser = await User.update(user, { where: { userId } });
		return updatedUser;
	}
}

export default new UserService();
