import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class Image extends Model {}

Image.init(
    {
        imageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        contentType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "productImage",
        tableName: "product_images",
    }
);

Image.beforeBulkCreate(async (productImages) => {
    let currentMaxOrder = await Image.max("displayOrder", {
        where: {
            productId: productImages[0].productId,
        },
    });
    for (const image of productImages) {
        image.displayOrder = 1 + currentMaxOrder ?? 0;
        currentMaxOrder++;
    }
});

Image.beforeCreate(async (productImage) => {
    let currentMaxOrder = await Image.max("displayOrder", {
        where: {
            productId: productImage.productId,
        },
    });
    productImage.displayOrder = 1 + currentMaxOrder ?? 0;
});

export default Image;
