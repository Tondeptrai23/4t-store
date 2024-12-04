import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class Product extends Model {}

Product.init(
    {
        productId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        size: {
            type: DataTypes.ENUM("S", "M", "L", "XL", "XXL"),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "product",
    }
);

export default Product;
