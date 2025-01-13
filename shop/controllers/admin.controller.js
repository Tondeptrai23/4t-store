import { Op } from "sequelize";
import { db } from "../config/config.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";

class AdminDashboardController {
    async dashboard(req, res) {
        try {
            const totalOrders = await Order.count();

            const totalRevenue = await Order.sum("total");

            const avgOrderValue = totalRevenue / totalOrders;

            const ordersByStatus = await Order.findAll({
                attributes: [
                    "status",
                    [db.fn("COUNT", db.col("orderId")), "count"],
                ],
                group: ["status"],
            });

            const recentOrders = await Order.findAll({
                limit: 5,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                ],
            });

            const deliveredOrders = await Order.count({
                where: { status: "delivered" },
            });
            const successRate = (deliveredOrders / totalOrders) * 100;

            res.render("admin/pages/dashboard", {
                layout: "admin/layouts/main",
                totalOrders,
                totalRevenue,
                avgOrderValue,
                ordersByStatus,
                recentOrders: transformOrderStatus(recentOrders),
                successRate,
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    async getDashboardData(req, res) {
        try {
            const period = parseInt(req.query.period) || 30;
            const endDate = new Date();
            const startDate = new Date(
                endDate.getTime() - period * 24 * 60 * 60 * 1000
            );

            // Get revenue data
            const revenueData = await Order.findAll({
                attributes: [
                    [db.fn("DATE", db.col("createdAt")), "date"],
                    [db.fn("SUM", db.col("total")), "revenue"],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                    status: {
                        [Op.ne]: "cancelled",
                    },
                },
                group: [db.fn("DATE", db.col("createdAt"))],
                order: [[db.fn("DATE", db.col("createdAt")), "ASC"]],
            });

            // Get order status data
            const orderStatusData = await Order.findAll({
                attributes: [
                    "status",
                    [db.fn("COUNT", db.col("orderId")), "count"],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                group: ["status"],
            });

            // Format data for charts
            const labels = revenueData.map((item) =>
                new Date(item.getDataValue("date")).toLocaleDateString("vi-VN")
            );
            const values = revenueData.map((item) =>
                parseFloat(item.getDataValue("revenue"))
            );

            const statusCounts = {
                delivered: 0,
                processing: 0,
                pending: 0,
                cancelled: 0,
            };

            orderStatusData.forEach((item) => {
                statusCounts[item.status] = parseInt(
                    item.getDataValue("count")
                );
            });

            res.json({
                revenueData: { labels, values },
                orderStatusData: Object.values(statusCounts),
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

function transformOrderStatus(orders) {
    const statusMap = {
        pending: "Chờ xử lý",
        processing: "Đang xử lý",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
    };

    return orders.map((order) => {
        const orderData = order.toJSON();
        orderData.status = statusMap[orderData.status];
        return orderData;
    });
}

export default new AdminDashboardController();
