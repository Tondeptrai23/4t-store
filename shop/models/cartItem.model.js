import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class CartItem extends Model {}

CartItem.init(
    {
        cartItemID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: "cartItem",
        timestamps: false,
        tableName: "cart_items",
    }
);

export default CartItem;
