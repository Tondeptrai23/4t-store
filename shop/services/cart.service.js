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

            const transformedCartItems = cartItems.map(cartItem => {
                const product = cartItem.product;
                const image = product.images.length > 0 ? product.images[0].path : null;
                return {
                    cartItemId: cartItem.cartItemID,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    userId: cartItem.userId,
                    name: product.name,
                    image: image,
                    price: product.price,
                    description: product.description, 
                };
            });

            return transformedCartItems;
        } catch (error) {
            throw new Error("Error fetching cartItems: " + error.message);
        }
    }
    updateCartItem = async (userId,productId, quantity) => {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            let cartItem = await CartItem.findOne({ where: { userId, productId } });
            if (cartItem) {
                cartItem.quantity = quantity;
                await cartItem.save();
            } 
            return cartItem;
        } catch (error) {
            throw new Error("Error updating cartItem: " + error.message);
        }
    };
    async addCartItem(userId, productId, quantity) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            let cartItem = await CartItem.findOne({ where: { userId, productId } });
            if (cartItem) {
                cartItem.quantity += quantity;
                await cartItem.save();
            } else {
                cartItem = await CartItem.create({
                    quantity,
                    userId,
                    productId,
                });
            }

            return cartItem;
        } catch (error) {
            throw new Error("Error adding cartItem: " + error.message);
        }
    };
    deleteCartItem = async (productId) => {
        try {
            // delete cartItem by productId
            const cartItem = await CartItem.findOne({ where: { productId } });
            if (!cartItem) {
                throw new Error(`CartItem with productId ${productId} not found`);
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