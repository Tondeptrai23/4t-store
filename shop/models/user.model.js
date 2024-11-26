import { DataTypes, Model } from "sequelize";
import db from "./index.model.js";

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
    },
    {
        sequelize: db,
    }
);

export default User;
