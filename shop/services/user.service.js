import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ModelError } from "../utils/errors.js";
import {
	FilterBuilder,
	PaginationBuilder,
	SortBuilder,
} from "../utils/condition.js";

export class ProductSortBuilder extends SortBuilder {
	constructor(requestQuery) {
		super(requestQuery);
		this._map = {
			name: ["name"],
			price: ["email"],
			updatedAt: ["createdAt"],
			role: ["role"], 
			createdAt: ["deletedAt"],
		};
		this._defaultSort = [["name", "ASC"]];
	}
}

export class ProductFilterBuilder extends FilterBuilder {
	constructor(requestQuery) {
		super(requestQuery);
		this._allowFields = [
			"name",
			"email",
			"createdAt",
			"deletedAt",
			"role"
		];
	}
}

class UserService {
	async getAll() {

		let users = await User.findAll();
		users = users.map((user) =>
			user.toJSON()
		);

		return users;
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

	// Get sorted, filtered, and paginated products
    getFilteredSortedAndPaginatedUsers = async (requestQuery) => {

        console.log("Query in service:", JSON.stringify(requestQuery));

        try {
            // Process filtered products
            const filterBuilder = new ProductFilterBuilder(requestQuery);
            const filterCriteria = filterBuilder.build();

            //Process sorted products
            const sortBuilder = new ProductSortBuilder(requestQuery);
            const sortCriteria = sortBuilder.build();

            // Process paginated products
            const paginationBuilder = new PaginationBuilder(requestQuery);
            const { limit, offset } = paginationBuilder.build();

            // Query products from the database
            const usersQuery = await User.findAll({
                where: filterCriteria,
                order: [...sortCriteria],
                limit,
                offset
            });

            const totalCount = await User.count({
                where: filterCriteria,
            });

    
            const totalPages = Math.ceil(totalCount / limit);

            return {
                count: totalCount,
                users: usersQuery,
                pagination: { limit, offset, totalPages }, // Trả lại thông tin phân trang (nếu cần)
            };
        } catch (err) {
            console.error(
                "Error in getFilteredSortedAndPaginatedUsers:",
                err
            );
            throw new Error("Error fetching users.");
        }
    };

	destroyById = async function(id) {
		try {
			const user = await User.findByPk(id);
            if (!user) {
                throw new ModelError("User not found");
            }
            await user.destroy({
				where: {
				  id: 1,
				}
			  });
            return { message: "User deleted successfully" };
		} catch (err){
			console.error("Error in destroyById:", err);
            throw new Error("Error deleting user.");
		}
	};


}

export default new UserService();


const test = new UserService();
const res = await test.getAll();

console.log(res);