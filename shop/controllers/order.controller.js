import api from "../config/api.js";
import orderService from "../services/order.service.js";
import OrderItemService from "../services/orderItems.service.js";

class OrderController {
    async getAll(req, res) {
        try {
            const { count, orders, pagination } = await orderService.getAll(
                req.query
            );
            const transformedOrders = transformOrderStatus(orders);

            res.status(200).send({
                success: true,
                count,
                orders: transformedOrders,
                pagination,
            });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getById(req, res) {
        try {
            const order = await orderService.getById(req.params.id);
            res.status(200).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async create(req, res) {
        try {
            const orderData = {
                total: req.body.total,
                address: req.body.address,
                userId: req.user.userId,
            };
            const cartItems = req.body.cart;

            const order = await orderService.create(orderData);
            const orderId = order.orderId;

            const orderItems = cartItems.map((item) => ({
                quantity: item.quantity,
                priceAtPurchase: item.price,
                orderId: orderId,
                productId: item.productId,
            }));

            await OrderItemService.addOrderItems(orderItems);

            res.status(201).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async update(req, res) {
        try {
            const order = await orderService.update(req.params.id, req.body);
            res.status(200).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async delete(req, res) {
        try {
            const order = await orderService.delete(req.params.id);
            res.status(200).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getByUserId(req, res) {
        try {
            if (!req.isAuthenticated()) {
                return res.send("Not authenticated");
            }

            const { pagination, orders } = await orderService.getByUserId(
                req.user.userId,
                req.query.page ?? 1,
                req.query.size ?? 3
            );

            // If it's an AJAX request, return JSON
            if (req.xhr) {
                return res.json({
                    orders,
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalOrders: pagination.totalItems,
                });
            }

            // For regular requests, render the page
            res.render("index", {
                body: "pages/orders",
                orders,
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalOrders: pagination.totalItems,
                isLoggedIn: true,
            });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async payment(req, res) {
        try {
            const isAuth = req.isAuthenticated();
            if (!isAuth) {
                return res.send("Not authenticated");
            }
            const orderData = {
                amount: req.body.total,
                orderId: req.body.orderId,
                message: "",
            };

            const response = await api.post(`/transfer`, orderData, {
                headers: {
                    Authorization: `Bearer ${req.user.paymentToken}`,
                },
            });

            console.log(response.data);

            res.send(response.data);
        } catch (error) {
            res.status(400).send(error.message);
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

export default new OrderController();
