import { DataTypes, Model } from "sequelize";
import { db } from "../config/config.js";

class User extends Model {
    //
}

User.init(
    {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },
        provider: {
            type: DataTypes.ENUM("local", "google", "facebook"),
            defaultValue: "local",
        },
    },
    {
        sequelize: db,
        modelName: "user",
        paranoid: true,
        deletedAt: "deletedAt",
    }
);

export default User;
