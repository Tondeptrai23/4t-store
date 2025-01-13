import Image from "../models/image.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import {
    FilterBuilder,
    PaginationBuilder,
    SortBuilder,
} from "../utils/condition.js";

export class OrderSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            status: ["status"],
            updatedAt: ["updatedAt"],
            createdAt: ["createdAt"],
            total: ["total"],
        };
        this._defaultSort = [["createdAt", "ASC"]];
    }
}

export class OrderFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "orderId",
            "total",
            "status",
            "userId",
            "updatedAt",
            "createdAt",
        ];
    }
}

class OrderService {
    getAll = async (requestQuery) => {
        try {
            const filterBuilder = new OrderFilterBuilder(requestQuery);
            const filterCriteria = filterBuilder.build();

            const sortBuilder = new OrderSortBuilder(requestQuery);
            const sortCriteria = sortBuilder.build();

            const paginationBuilder = new PaginationBuilder(requestQuery);
            const { limit, offset } = paginationBuilder.build();

            const { count, rows: satisfiedOrders } =
                await Order.findAndCountAll({
                    where: filterCriteria,
                    order: [...sortCriteria],
                    limit,
                    offset,
                });

            const orders = await Order.findAll({
                where: {
                    orderId: satisfiedOrders.map((order) => order.orderId),
                },
                include: [
                    {
                        model: OrderItem,
                        as: "orderItems",
                        required: false,
                        include: [
                            {
                                model: Product,
                                as: "product",
                                required: false,
                                include: {
                                    model: Image,
                                    as: "images",
                                    required: false,
                                },
                            },
                        ],
                    },
                ],
                order: [...sortCriteria],
            });

            return {
                count,
                orders,
                pagination: {
                    limit,
                    offset,
                    totalPages: Math.ceil(count / limit),
                },
            };
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
        } catch (error) {
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
