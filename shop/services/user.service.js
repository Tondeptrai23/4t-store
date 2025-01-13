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
			destroyTime: ["destroyTime"],
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
					destroyTime: {
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

				if (existingUser.destroyTime !== null) {

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

		console.log("Query in service:", JSON.stringify(requestQuery));

		try {
			const { page = 1, size = 10, sort = 'createdAt', order = 'ASC', name = '' } = requestQuery;

			// Pagination
			const limit = parseInt(size, 10);
			const offset = (page - 1) * limit;

			// Sort
			const sortCriteria = [[sort, order]];


			const filterBuilder = new UserFilterBuilder(requestQuery);
			const filterCriteria = filterBuilder.build();

			let users = await User.findAll({
				where: filterCriteria,

			});

			users = users.map(user =>
				user.toJSON()
			)

			users.sort((a, b) => {
				if (sortCriteria && sortCriteria.length > 0) {
					const [sortColumn, sortOrder] = sortCriteria[0];
					const direction = sortOrder === 'DESC' ? -1 : 1;

					const valueA = a[sortColumn];
					const valueB = b[sortColumn];

					// Xử lý nếu giá trị là null hoặc undefined
					if (valueA == null && valueB == null) return 0;
					if (valueA == null) return -1 * direction;
					if (valueB == null) return 1 * direction;

					// So sánh giá trị dựa trên kiểu dữ liệu
					if (typeof valueA === 'string' && typeof valueB === 'string') {
						// Chuỗi: dùng localeCompare
						return valueA.localeCompare(valueB) * direction;
					} else if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
						// Ngày tháng: so sánh theo thời gian
						return (new Date(valueA) - new Date(valueB)) * direction;
					} else if (typeof valueA === 'number' && typeof valueB === 'number') {
						// Số: so sánh trực tiếp
						return (valueA - valueB) * direction;
					} else {
						// Mặc định: chuyển về chuỗi và so sánh
						return valueA.toString().localeCompare(valueB.toString()) * direction;
					}
				}
				return 0; // Không có tiêu chí sắp xếp
			});


			const paginatedUsers = users.slice(offset, offset + limit);

			const totalCount = users.length;

			const totalPages = Math.ceil(totalCount / limit);

			return {
				count: totalCount,
				users: paginatedUsers, // Trả về các categories đã phân trang
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

		console.log("Query in service:", JSON.stringify(requestQuery));

		try {
			const { page = 1, size = 10, sort = 'createdAt', order = 'ASC', name = '' } = requestQuery;

			// Pagination
			const limit = parseInt(size, 10);
			const offset = (page - 1) * limit;

			// Sort
			const sortCriteria = [[sort, order]];


			const filterBuilder = new UserFilterBuilder(requestQuery);
			const filterCriteria = filterBuilder.build();

			let users = await User.findAll({
				where: {
					...filterCriteria, // Các điều kiện lọc khác
					destroyTime: { [Op.not]: null }, // Chỉ lấy các bản ghi có destroyTime khác null
				},
				paranoid: false
			});

			users = users.map(user =>
				user.toJSON()
			)

			users.sort((a, b) => {
				if (sortCriteria && sortCriteria.length > 0) {
					const [sortColumn, sortOrder] = sortCriteria[0];
					const direction = sortOrder === 'DESC' ? -1 : 1;

					const valueA = a[sortColumn];
					const valueB = b[sortColumn];

					// Xử lý nếu giá trị là null hoặc undefined
					if (valueA == null && valueB == null) return 0;
					if (valueA == null) return -1 * direction;
					if (valueB == null) return 1 * direction;

					// So sánh giá trị dựa trên kiểu dữ liệu
					if (typeof valueA === 'string' && typeof valueB === 'string') {
						// Chuỗi: dùng localeCompare
						return valueA.localeCompare(valueB) * direction;
					} else if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
						// Ngày tháng: so sánh theo thời gian
						return (new Date(valueA) - new Date(valueB)) * direction;
					} else if (typeof valueA === 'number' && typeof valueB === 'number') {
						// Số: so sánh trực tiếp
						return (valueA - valueB) * direction;
					} else {
						// Mặc định: chuyển về chuỗi và so sánh
						return valueA.toString().localeCompare(valueB.toString()) * direction;
					}
				}
				return 0; // Không có tiêu chí sắp xếp
			});


			const paginatedUsers = users.slice(offset, offset + limit);

			const totalCount = users.length;

			const totalPages = Math.ceil(totalCount / limit);

			return {
				count: totalCount,
				users: paginatedUsers, // Trả về các categories đã phân trang
				pagination: { limit, offset, totalPages }, // Trả lại thông tin phân trang (nếu cần)
			};
		} catch (err) {
			console.error(
				"Error in getFilteredSortedAndPaginatedUsers:",
				err
			);
			throw new Error("Error fetching users.");
		}

	}


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


const test = new UserService();
const res = await test.getAll();

console.log(res);