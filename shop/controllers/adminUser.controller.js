import api from "../config/api.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

class AdminUserController {
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
