import CartItemService from "../services/cart.service.js";

class CartController {
    async addToCart(req, res) {
        try {
            const cartItem = await CartItemService.addToCart(req.body);
            res.status(201).send(cartItem);
        } catch (error) {
        res.status(400).send(error.message);
        }
    }

    async getCart(req, res) {
        try {
            const isLoggedIn = req.isAuthenticated();
            // const cart = await CartItemService.getCart();
            res.render('index', { body: 'pages/shopingCart', isLoggedIn });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteCartItem(req, res) {
        try {
            const cart = await CartItemService.deleteCartItem(req.params.id);
            res.status(200).send(cart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async updateCartItem(req, res) {
        try {
            const cart = await CartItemService.updateCartItem(req.params.id, req.body);
            res.status(200).send(cart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async checkout(req, res) {
        try {
            const order = await CartItemService.checkout(req.body);
            res.status(200).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

export default new CartController();