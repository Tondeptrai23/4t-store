import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class Order extends Model {}

Order.init(
    {
        orderId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "cancelled",
                "delivered"
            ),
            defaultValue: "pending",
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
    },
    {
        sequelize: db,
        modelName: "order",
    }
);

export default Order;
