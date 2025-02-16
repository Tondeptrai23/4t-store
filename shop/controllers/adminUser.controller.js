import userService from "../services/user.service.js";

class AdminUserController {
    async listUsers(req, res) {
        try {
            const users = await userService.getExistingUsers();

            console.log(users);

            res.render("admin/pages/users/list", {
                layout: "admin/layouts/main",
                users,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async listDeletedUsers(req, res) {
        try {
            const users = await userService.getDeletedUsers();

            console.log(users);

            res.render("admin/pages/users/deleted-list", {
                layout: "admin/layouts/main",
                users,
            });
        } catch (error) {
            console.error("Error fetching deleted users:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getUsers(req, res) {
        try {
            const requestQuery = req.query; // Lấy các tham số từ query string
            console.log("get users " + JSON.stringify(requestQuery));
            const result = await userService.getFilteredSortedAndPaginatedUsers(
                requestQuery
            );

            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching users:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch users.",
            });
        }
    }

    async getDeleteUsers(req, res) {
        try {
            const requestQuery = req.query; // Lấy các tham số từ query string
            console.log("get users " + JSON.stringify(requestQuery));
            const result =
                await userService.getFilteredSortedAndPaginatedDeletedUsers(
                    requestQuery
                );

            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching users:", error.message);
            res.status(500).json({
                success: false,
                message: `Failed to fetch users. ${error.message}`,
            });
        }
    }

    async showCreateForm(req, res) {
        try {
            res.render("admin/pages/users/create", {
                layout: "admin/layouts/main",
            });
        } catch (error) {
            console.error("Error loading create user form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            console.log(userData);

            const newUser = await userService.create(userData);

            res.status(201).json({
                success: true,
                message: "User created successfully",
                user: newUser,
            });
        } catch (error) {
            console.error("Error creating user :", error.message);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            let user = await userService.findById(id);

            res.render("admin/pages/users/edit", {
                layout: "admin/layouts/main",
                user,
            });
        } catch (error) {
            console.error("Error loading edit user form:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, role } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required",
                });
            }

            console.log("Test update user", name, role);

            // Gọi service để cập nhật người dùng
            const updatedUser = await userService.update(id, { name, role });

            // Nếu không tìm thấy người dùng, trả về lỗi
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: `User with ID ${id} not found`,
                });
            }

            // Trả về kết quả sau khi cập nhật
            res.json({
                success: true,
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update user",
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            console.log("User " + id + " deleted");
            await userService.deleteById(id);

            res.json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete user",
            });
        }
    }

    async bulkDeleteUsers(req, res) {
        try {
            const { ids } = req.body;
            await userService.bulkDelete(ids);

            res.json({
                success: true,
                message: "Users deleted successfully",
            });
        } catch (error) {
            console.error("Error bulk deleting users:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete users",
            });
        }
    }

    async getUserDetail(req, res) {
        try {
            const userId = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = 5;
            const offset = (page - 1) * limit;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }

            // Get total count of orders for pagination
            const totalOrders = await Order.count({
                where: { userId },
            });

            const orders = await Order.findAll({
                where: { userId },
                order: [["createdAt", "DESC"]],
                limit,
                offset,
            });

            const balanceResponse = await api.get(
                `/admin/balance/${user.email}`,
                {
                    headers: {
                        Authorization: `Bearer ${req.user.paymentToken}`,
                    },
                }
            );

            const transformedOrders = orders.map((order) => {
                const orderData = order.toJSON();
                const statusMap = {
                    pending: "Chờ xử lý",
                    processing: "Đang xử lý",
                    delivered: "Đã giao",
                    cancelled: "Đã hủy",
                };
                orderData.status = statusMap[orderData.status];
                return orderData;
            });

            // If it's an AJAX request, return JSON
            if (req.xhr) {
                return res.json({
                    orders: transformedOrders,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalOrders / limit),
                        totalOrders,
                    },
                });
            }

            res.render("admin/pages/users/detail", {
                layout: "admin/layouts/main",
                user,
                orders: transformedOrders,
                balance: balanceResponse.data.balance,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalOrders / limit),
                    totalOrders,
                },
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

export default new AdminUserController();
