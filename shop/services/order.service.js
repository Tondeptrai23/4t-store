import Order from "../models/order.model.js";


class OrderService {
    getAll = async () => {
        try {
            const orders = await Order.findAll();
            return orders;
        } catch (error) {
            throw new Error("Error fetching orders: " + error.message);
        }
    };
    getById = async (orderId) => {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            return order;
        } catch (error) {
            throw new Error("Error fetching order: " + error.message);
        }
    };
    create = async (orderData) => {
        try {
            const order = await Order.create(orderData);
            return order;
        }
        catch (error) {
            throw new Error("Error creating order: " + error.message);
        }
    };
    update = async (orderId, orderData) => {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            await order.update(orderData);
            return order;
        } catch (error) {
            throw new Error("Error updating order: " + error.message);
        }
    };
    delete = async (orderId) => {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            await order.destroy();
            return order;
        } catch (error) {
            throw new Error("Error deleting order: " + error.message);
        }
    };
    getByUserId = async (userId) => {
        try {
            const orders = await Order.findAll({
                where: {
                    userId,
                },
            });
            return orders;
        } catch (error) {
            throw new Error("Error fetching orders: " + error.message);
        }
    };
}

export default new OrderService();