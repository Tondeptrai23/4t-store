import { db } from "../config/config.js";
import CartItem from "./cartItem.model.js";
import Category from "./category.model.js";
import Image from "./image.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Product from "./product.model.js";
import User from "./user.model.js";

Product.belongsTo(Category, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
});

Category.hasMany(Product, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
});

Product.hasMany(Image, {
    foreignKey: "productId",
    onDelete: "CASCADE",
});

Image.belongsTo(Product, {
    foreignKey: "productId",
    onDelete: "CASCADE",
});

User.hasMany(Order, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Order.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
});

Product.hasMany(OrderItem, {
    foreignKey: "productId",
    onDelete: "CASCADE",
});

OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    onDelete: "CASCADE",
});

User.hasMany(CartItem, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

CartItem.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

export default db;
