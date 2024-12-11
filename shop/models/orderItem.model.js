import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class OrderItem extends Model {}

OrderItem.init(
    {
        orderItemId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priceAtPurchase: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "orderItem",
        timestamps: false,
        tableName: "order_items",
    }
);

export default OrderItem;
