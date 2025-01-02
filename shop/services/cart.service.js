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

    syncCart = async (userId, cart) => {
        try {
            const cartItems = await CartItem.findAll({
                where: {
                    userId,
                },
            });
            const cartItemIds = cartItems.map((cartItem) => cartItem.productId);
            const cartItemIdsInCart = cart.map((item) => item.productId);
            const cartItemsToDelete = cartItems.filter(
                (cartItem) => !cartItemIdsInCart.includes(cartItem.productId)
            );
            const cartItemsToAdd = cart.filter(
                (item) => !cartItemIds.includes(item.productId)
            );
            const cartItemsToUpdate = cart.filter((item) =>
                cartItemIds.includes(item.productId)
            );
            await Promise.all(
                cartItemsToDelete.map((cartItem) => cartItem.destroy())
            );
            await Promise.all(
                cartItemsToAdd.map((item) =>
                    CartItem.create({
                        userId,
                        productId: item.productId,
                        quantity: item.quantity,
                    })
                )
            );
            await Promise.all(
                cartItemsToUpdate.map((item) =>
                    CartItem.update(
                        { quantity: item.quantity },
                        {
                            where: {
                                userId,
                                productId: item.productId,
                            },
                        }
                    )
                )
            );
        } catch (error) {
            throw new Error("Error syncing cart: " + error.message);
        }
    };
}

export default new CartItemService();