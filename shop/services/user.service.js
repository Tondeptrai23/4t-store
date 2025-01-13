import bcrypt from "bcrypt";
import User from "../models/user.model.js";
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

    async updatePassword(id, password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.update(
            { password: hashedPassword },
            { where: { userId: id } }
        );

        return true;
    }

    async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }
}

export default new UserService();
