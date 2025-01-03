import CartItemService from "../services/cart.service.js";

class CartController {
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            let updatedCart = [];
            const cartItem = await CartItemService.addCartItem(req.user.userId, productId, quantity);
            updatedCart = await CartItemService.getCartItems(req.user.userId); 
            res.status(201).send(updatedCart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getCart(req, res) {
        try {
            const isLoggedIn = req.isAuthenticated();
            res.render('index', { body: 'pages/shoppingCart', isLoggedIn});
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    
    async getCartItems(req, res) {
        try {
            const cart = await CartItemService.getCartItems(req.user.userId);
            res.status(200).send(cart);
        }catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteCartItem(req, res) {
        try {
            const { productId } = req.body;
            await CartItemService.deleteCartItem(productId);
            let cart = await CartItemService.getCartItems(req.user.userId);
            res.status(200).send(cart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async updateCartItem(req, res) {
        try {            
            const { productId, quantity } = req.body;
            await CartItemService.updateCartItem(req.user.userId,productId, quantity);
            const updatedCart = await CartItemService.getCartItems(req.user.userId); 
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async syncCart(req, res) {
        try {
            const { cart } = req.body;
            let updatedCart = [];
            for (const item of cart) {
                await CartItemService.addCartItem(req.user.userId, item.productId, item.quantity);
            }
            updatedCart = await CartItemService.getCartItems(req.user.userId);
            res.status(200).send(updatedCart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

export default new CartController();