import CartItemService from "../services/cart.service.js";

class CartController {
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            let updatedCart = [];
            const cartItem = await CartItemService.addToCart(req.user.id, productId, quantity);
            updatedCart = await CartItemService.getCartItems(req.user.id); 
            res.status(201).send(updatedCart);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getCart(req, res) {
        try {
            const isLoggedIn = req.isAuthenticated();
            res.render('index', { body: 'pages/shopingCart', isLoggedIn });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteCartItem(req, res) {
        try {
            const {cartItemId} = req.body;
            await CartItemService.deleteCartItem(cartItemId);
            let cart = await CartItemService.getCartItems(req.user.id);
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
            const isLoggedIn = req.isAuthenticated();
            if (!isLoggedIn) {
                return res.status(401).send({message: 'Bạn cần đăng nhập để thực hiện chức năng này'});
            }else{
                // đồng bộ giữa local storage và database
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length > 0){
                    await CartItemService.syncCart(req.user.id, cart);
                    localStorage.removeItem('cart');
                }
            }
            res.render('index', { body: 'pages/checkout', isLoggedIn });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

export default new CartController();