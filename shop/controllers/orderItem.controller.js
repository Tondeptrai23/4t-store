import OrderItemService from '../services/orderItem.service';

class OrderItemController {
    async createOrderItem(req, res) {
        const { productId, quantity, orderId } = req.body;
        const orderItem = await OrderItemService.createOrderItem({
        productId,
        quantity,
        orderId,
        });
        return res.status(201).json(orderItem);
    }

    async getOrderItemById(req, res) {
        const orderItem = await OrderItemService.getOrderItemById(req.params.id);
        return res.status(200).json(orderItem);
    }

}

export default new OrderItemController();