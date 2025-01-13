import api from "../config/api.js";
import orderService from "../services/order.service.js";
import userService from "../services/user.service.js";

class AdminOrderController {
    async orderDetails(req, res) {
        try {
            const orderId = req.params.orderId;

            // Fetch order with related data
            const order = await orderService.getById(orderId);
            if (!order) {
                return res.status(404).render("admin/pages/error", {
                    layout: "admin/layouts/main",
                    message: "Không tìm thấy đơn hàng",
                });
            }

            // Fetch transaction data from payment service
            let transaction = null;
            try {
                const response = await api.get(`/transactions/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${req.user.paymentToken}`,
                    },
                });

                transaction = response.data.transaction;

                if (transaction) {
                    const [fromUser, toUser] = await Promise.all([
                        userService.findByEmail(transaction.fromUser.username),
                        userService.findByEmail(transaction.toUser.username),
                    ]);

                    transaction.fromUserDetails = fromUser;
                    transaction.toUserDetails = toUser;
                }
            } catch (error) {
                console.error("Error fetching transaction:", error);
            }

            res.render("admin/pages/orders/detail", {
                layout: "admin/layouts/main",
                order: transformOrderStatus([order])[0],
                transaction,
            });
        } catch (error) {
            console.error("Error fetching order details:", error);
            res.status(500).send("Internal Server Error");
        }
    }

	async listOrders(req, res) {
		try {
			const { orders } = await orderService.getAll();
			const transformedOrders = transformOrderStatus(orders);

			res.render("admin/pages/orders/list", {
				layout: "admin/layouts/main",
				orders: transformedOrders,
			});
		} catch (error) {
			console.error("Error fetching orders:", error);
			res.status(500).send("Internal Server Error");
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

export default new AdminOrderController();
