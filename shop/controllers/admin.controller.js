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
                recentOrders,
                successRate,
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}

export default new AdminDashboardController();
