import OrderItem from "../models/orderItem.model.js";

class OrderItemService {
    getAll = async () => {
        try {
            const orderItems = await OrderItem.findAll();
            return orderItems;
        } catch (error) {
            throw new Error("Error fetching order items: " + error.message);
        }
    };
    getById = async (orderItemId) => {
        try {
            const orderItem = await OrderItem.findByPk(orderItemId);
            if (!orderItem) {
                throw new Error(`Order item with ID ${orderItemId} not found`);
            }
            return orderItem;
        } catch (error) {
            throw new Error("Error fetching order item: " + error.message);
        }
    };
    create = async (orderItemData) => {
        try {
            const orderItem = await OrderItem.create(orderItemData);
            return orderItem;
        } catch (error) {
            throw new Error("Error creating order item: " + error.message);
        }
    };
    update = async (orderItemId, orderItemData) => {
        try {
            const orderItem = await OrderItem.findByPk(orderItemId);
            if (!orderItem) {
                throw new Error(`Order item with ID ${orderItemId} not found`);
            }
            await orderItem.update(orderItemData);
            return orderItem;
        } catch (error) {
            throw new Error("Error updating order item: " + error.message);
        }
    };
    delete = async (orderItemId) => {
        try {
            const orderItem = await OrderItem.findByPk(orderItemId);
            if (!orderItem) {
                throw new Error(`Order item with ID ${orderItemId} not found`);
            }
            await orderItem.destroy();
            return orderItem;
        } catch (error) {
            throw new Error("Error deleting order item: " + error.message);
        }
    };
    getByOrderId = async (orderId) => {
        try {
            const orderItems = await OrderItem.findAll({
                where: {
                    orderId,
                },
            });
            return orderItems;
        } catch (error) {
            throw new Error("Error fetching order items: " + error.message);
        }
    };
}

export default new OrderItemService();