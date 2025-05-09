import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Transaction = sequelize.define("Transaction", {
    fromUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    toUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
    },
    message: {
        type: DataTypes.STRING,
    },
    orderId: {
        type: DataTypes.STRING,
    },
});

Transaction.belongsTo(User, {
    foreignKey: "fromUserId",
    as: "fromUser",
});

Transaction.belongsTo(User, {
    foreignKey: "toUserId",
    as: "toUser",
});

export default Transaction;
