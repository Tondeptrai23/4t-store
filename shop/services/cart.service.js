import CartItem from '../models/cartItem.model.js';
import Product from '../models/product.model.js';
import Image from '../models/image.model.js';


class CartItemService{
    getCartItems = async (userId) => {
        try {
            const cartItems = await CartItem.findAll({
                where: {
                    userId,
                },
                include: [
                    {
                        model: Product,
                        as: "product",
                        include: [
                            {
                                model: Image,
                                as: "images",
                                required: false,
                            },
                        ],
                    },
                ],
            });
            return cartItems;
        } catch (error) {
            throw new Error("Error fetching cartItems: " + error.message);
        }
    }
    updateCartItem = async (cartItemId, quantity) => {
        try {
            const cartItem = await CartItem.findByPk(cartItemId);
            if (!cartItem) {
                throw new Error(`CartItem with ID ${cartItemId} not found`);
            }
            cartItem.quantity = quantity;
            await cartItem.save();
            return cartItem;
        } catch (error) {
            throw new Error("Error updating cartItem: " + error.message);
        }
    };
    addCartItem = async (userId, productId, quantity) => {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            const cartItem = await CartItem.create({
                userId,
                productId,
                quantity,
            });
            return cartItem;
        } catch (error) {
            throw new Error("Error adding cartItem: " + error.message);
        }
    };
    deleteCartItem = async (cartItemId) => {
        try {
            const cartItem = await CartItem.findByPk(cartItemId);
            if (!cartItem) {
                throw new Error(`CartItem with ID ${cartItemId} not found`);
            }
            await cartItem.destroy();
            return cartItem;
        } catch (error) {
            throw new Error("Error deleting cartItem: " + error.message);
        }
    };
}

export default new CartItemService();