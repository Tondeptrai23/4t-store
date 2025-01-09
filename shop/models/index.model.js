import { db } from "../config/config.js";
import CartItem from "./cartItem.model.js";
import Category from "./category.model.js";
import Image from "./image.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Product from "./product.model.js";
import SubCategory from "./subCategory.model.js";
import User from "./user.model.js";

Product.belongsTo(SubCategory, {
    foreignKey: "categoryId",
    onDelete: "SET NULL",
});

SubCategory.hasMany(Product, {
    foreignKey: "categoryId",
    onDelete: "SET NULL",
});

SubCategory.belongsTo(Category, {
    foreignKey: "parentId",
    onDelete: "SET NULL",
});

Category.hasMany(SubCategory, {
    foreignKey: "parentId",
    onDelete: "SET NULL",
});

Product.hasMany(Image, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    as: "images",
});

Image.belongsTo(Product, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    as: "product",
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
    onDelete: "SET NULL",
});

OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    onDelete: "SET NULL",
});

User.hasMany(CartItem, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

CartItem.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

CartItem.belongsTo(Product, {
    foreignKey: "productId",
    onDelete: "CASCADE",
});

export default db;
