import CartItemService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import { ModelError } from "../utils/errors.js";

class AuthController {
	loginView(request, response) {
		if (request.isAuthenticated()) {
			return response.render("pages/auth/authenticated");
		}

		let errorMsg = request.query["invalid-credentials"]
			? "Email hoặc mật khẩu bạn nhập không chính xác. Xin vui lòng thử lại."
			: null;
		errorMsg = request.query["google-auth-failed"]
			? "Đăng nhập bằng Google thất bại. Vui lòng thử lại."
			: errorMsg;
		errorMsg = request.query["facebook-auth-failed"]
			? "Đăng nhập bằng Facebook thất bại. Vui lòng thử lại."
			: errorMsg;

		return response.render("pages/auth/login", { errorMsg: errorMsg });
	}

	registerView(request, response) {
		if (request.isAuthenticated()) {
			return response.render("pages/auth/authenticated");
		}
		return response.render("pages/auth/register", { errorMsg: null });
	}

	logout(request, response) {
		request.logout((error) => {
			if (error) {
				throw new Error(error);
			}
			response.redirect("/");
		});
	}

	async checkEmail(request, response) {
		const { email } = request.body;
		const user = await UserService.findByEmail(email);
		if (user) {
			return response.json({ isExisted: true });
		}
		return response.json({ isExisted: false });
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
				if (error) {
					console.log(user);
					return response.render("pages/auth/register", {
						errorMsg: "Đăng ký thất bại. Vui lòng thử lại.",
					});
				}
				response.redirect("/");
			});
		} catch (error) {
			if (error instanceof ModelError) {
				return response.render("pages/auth/register", {
					errorMsg: "Email đã tồn tại. Vui lòng sử dụng email khác.",
				});
			}
			throw new Error(error);
		}
	}

	async afterLogin(request, response) {
		const { redirectUrl, cartData } = request.body;
		if (cartData) {
			const cartItems = cartData;
			for (let i = 0; i < cartItems.length; i++) {
				const cartItem = cartItems[i];
				await CartItemService.addCartItem(
					request.user.userId,
					cartItem.productId,
					cartItem.quantity
				);
			}
		}
		// response.redirect(redirectUrl);
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }

	successRedirect(_request, response) {
		response.redirect("/");
	}
}

export default new AuthController();
