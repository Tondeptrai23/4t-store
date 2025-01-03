import UserService from "../services/user.service.js";
import CartItemService from "../services/cart.service.js";

class AuthController {
	loginView(_request, response) {
		return response.render("pages/auth/login");
	}

	registerView(_request, response) {
		return response.render("pages/auth/register");
	}

	logout(request, response) {
		request.logout((error) => {
			if (error) { throw new Error(error); }
			response.redirect("/");
		});
	}

	async register(request, response) {
		const { name, email, password } = request.body;
		const data = {
			name,
			email,
			password,
			role: "user",
		};

		try {
			const user = await UserService.create(data);
			request.login(user, (error) => {
				if (error) { throw new Error(error); }
				response.redirect("/");
			});
		}
		catch (error) {
			throw new Error(error);
		}
	}

	async postLogin(req, res) {
		const { redirectUrl, cartData } = req.body;
		if (cartData) {
            try {
                const cartItems = JSON.parse(cartData);
                for (let i = 0; i < cartItems.length; i++) {
                    const cartItem = cartItems[i];
                    await CartItemService.addCartItem(req.user.userId, cartItem.productId, cartItem.quantity);
                }
            } catch (error) {
                console.error('Error syncing cart data:', error);
                return res.status(500).send('Error syncing cart data');
            }
        }
		res.redirect(redirectUrl);
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }
}

export default new AuthController();