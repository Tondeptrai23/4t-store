import CartItemService from "../services/cart.service.js";

class CartController {
    async addToCart(req, res) {
        try {
            const {productId, quantity} = req.body;
            if (req.isAuthenticated()){
                const cartItem = await CartItemService.addToCart(req.user.id, productId, quantity);
            }
            else {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let index = cart.findIndex(item => item.productId === productId);
                if (index !== -1) {
                    cart[index].quantity += quantity;
                } else {
                    cart.push({productId, quantity});
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                return res.status(201).send({message: 'Sản phẩm đã được thêm vào giỏ hàng'});
            }
            res.status(201).send(cartItem);
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
            if (req.isAuthenticated()){
                const cart = await CartItemService.deleteCartItem(cartItemId);
            }
            else{
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.productId !== cartItemId);
                localStorage.setItem('cart', JSON.stringify(cart));
                return res.status(200).send(cart);
            }
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