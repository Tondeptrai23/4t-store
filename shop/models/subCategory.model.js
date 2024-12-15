import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class SubCategory extends Model {}

SubCategory.init(
    {
        categoryId: {
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
        },
    },
    {
        sequelize: db,
        modelName: "sub-category",
    }
);

export default SubCategory;
