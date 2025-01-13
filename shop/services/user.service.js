import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ModelError } from "../utils/errors.js";
import { Op } from 'sequelize'
import {
	FilterBuilder,
	PaginationBuilder,
	SortBuilder,
} from "../utils/condition.js";

export class UserSortBuilder extends SortBuilder {
	constructor(requestQuery) {
		super(requestQuery);
		this._map = {
			name: ["name"],
			email: ["email"],
			createdAt: ["createdAt"],
			updatedAt: ["updatedAt"],
			role: ["role"],
			deletedAt: ["deletedAt"]
		};
		this._defaultSort = [["name", "ASC"]];
	}
}

export class UserFilterBuilder extends FilterBuilder {
	constructor(requestQuery) {
		super(requestQuery);
		this._allowFields = [
			"name",
			"email",
			"createdAt",
			"updatedAt",
			"destroyTime",
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

	async getExistingUsers() {
		try {
			// Lấy tất cả user chưa bị xóa mềm
			let users = await User.findAll({
				paranoid: true,  // Chỉ lấy user chưa bị xóa
			});

			// Chuyển đổi dữ liệu thành JSON
			users = users.map((user) => user.toJSON());

			return users;
		} catch (error) {
			console.error("Error in getAll:", error);
			throw new Error("Failed to fetch users.");
		}
	}

	async getDeletedUsers() {
		try {
			// Lấy tất cả user với điều kiện destroyTime khác null
			let users = await User.findAll({
				where: {
					deletedAt: {
						[Op.ne]: null, // Điều kiện: destroyTime khác null
					},
				},
			});

			// Chuyển đổi dữ liệu thành JSON
			users = users.map((user) => user.toJSON());

			return users;
		} catch (error) {
			console.error("Error in getDeletedUsers:", error);
			throw new Error("Failed to fetch deleted users.");
		}
	}

	async findByEmail(email) {
		return await User.findOne({ where: { email } });
	}

	async findById(id) {
		return await User.findByPk(id);
	}

	async create(user) {
		try {

			const existingUser = await User.findOne({
				where: { email: user.email },
				paranoid: false,
			});

			if (existingUser) {

				if (existingUser.deletedAt !== null) {

					console.log('User exists and is soft-deleted, creating a new user with the same email');

					throw new Error("Email này đã được đăng ký và bị xóa. Không thể phục hồi!");
				}

				throw new Error("Email này đã được sử dụng. Vui lòng chọn email khác.");
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			const insertedUser = await User.create(user);
			return insertedUser;

		} catch (error) {
			console.error("Error creating user:", error.message);
			throw new Error(error.message || "An error occurred while creating the user.");
		}
	}

	// Get sorted, filtered, and paginated products
	getFilteredSortedAndPaginatedUsers = async (requestQuery) => {
        console.log("Query in service:", requestQuery);

        try {

            const preprocessRequestQuery = (query) => {
                let processedQuery = { ...query }; 
                console.log("processed query: ", processedQuery);
             
                if (processedQuery.sort && processedQuery.order) {
                    if (processedQuery.order.toUpperCase() === "DESC") {
                        processedQuery.sort = `-${processedQuery.sort}`;
                    }

                    console.log("Processed query after solve: ", processedQuery);
                }

                return processedQuery;
            };

            const processedQuery = preprocessRequestQuery(requestQuery);

            // Process filtered users
            const filterBuilder = new UserFilterBuilder(processedQuery);
            const filterCriteria = filterBuilder.build();

            //Process sorted users
            const sortBuilder = new UserSortBuilder(processedQuery);
            const sortCriteria = sortBuilder.build();

            // Process paginated products
            const paginationBuilder = new PaginationBuilder(processedQuery);
            const { limit, offset } = paginationBuilder.build();

            // Query users from the database
            let usersQuery = await User.findAll({
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


	getFilteredSortedAndPaginatedDeletedUsers = async (requestQuery) => {
        console.log("Query in service:", requestQuery);

        try {

            const preprocessRequestQuery = (query) => {
                let processedQuery = { ...query }; 
                console.log("processed query: ", processedQuery);
             
                if (processedQuery.sort && processedQuery.order) {
                    if (processedQuery.order.toUpperCase() === "DESC") {
                        processedQuery.sort = `-${processedQuery.sort}`;
                    }

                    console.log("Processed query after solve: ", processedQuery);
                }

                return processedQuery;
            };

            const processedQuery = preprocessRequestQuery(requestQuery);

            // Process filtered users
            const filterBuilder = new UserFilterBuilder(processedQuery);
            const filterCriteria = filterBuilder.build();

            //Process sorted users
            const sortBuilder = new UserSortBuilder(processedQuery);
            const sortCriteria = sortBuilder.build();

            // Process paginated users
            const paginationBuilder = new PaginationBuilder(processedQuery);
            const { limit, offset } = paginationBuilder.build();

            // Query users from the database
            let usersQuery = await User.findAll({
                where: {
					...filterCriteria,
					deletedAt: {
                        [Op.ne]: null, 
                    },
				},
                order: [...sortCriteria],
                limit,
                offset,
				paranoid: false
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

	deleteById = async function (id) {
		try {
			const user = await User.findByPk(id);
			if (!user) {
				throw new ModelError("User not found");
			}
			await User.destroy({
				where: {
					userId: id,
				}
			});
			return { message: "User deleted successfully" };
		} catch (err) {
			console.error("Error in destroyById:", err);
			throw new Error("Error deleting user.");
		}
	}

	bulkDelete = async (userIds) => {
		try {
			const result = await User.destroy({
				where: {
					userId: userIds,
				},
			});

			return result;
		} catch (error) {
			console.error("Error in bulkDelete:", error);
			throw new Error("Failed to delete users");
		}
	};

	update = async (userId, userData) => {
		try {

			console.log("Updating in service " + userId);

			// Tìm người dùng theo ID
			const user = await User.findByPk(userId);

			if (!user) {
				throw new Error(`User with ID ${userId} not found`);
			}

			// Tạo đối tượng chỉ chứa các trường cần update (name, role)
			const fieldsToUpdate = {};

			if (userData.name) fieldsToUpdate.name = userData.name;
			if (userData.role) fieldsToUpdate.role = userData.role;

			// Kiểm tra và cập nhật nếu có trường hợp hợp lệ
			if (Object.keys(fieldsToUpdate).length > 0) {
				await user.update(fieldsToUpdate);
			}

			// Trả về thông tin người dùng sau khi cập nhật
			return await User.findByPk(userId);

		} catch (error) {
			throw new Error("Failed to update user: " + error.message);
		}
	};


}

export default new UserService();
