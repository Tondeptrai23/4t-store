import { AxiosError } from "axios";
import passport from "passport";
import api from "../config/api.js";
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
			? "Đăng nhập bằng Google thất bại. Có thế do bạn từ chối cung cấp email hoặc đã tồn tại một tài khoản sử dụng email của bạn. Vui lòng thử lại."
			: errorMsg;
		errorMsg = request.query["facebook-auth-failed"]
			? "Đăng nhập bằng Facebook thất bại. Có thế do bạn từ chối cung cấp email hoặc đã tồn tại một tài khoản sử dụng email của bạn. Vui lòng thử lại."
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

	localAuthenticate(request, response, next) {
		const redirectTo = request.session.redirectTo || "/";
		delete request.session.redirectTo;

		const authenticator = passport.authenticate("local", (err, user, info) => {
			if (err) { return next(err); }
			if (!user) {
				return response.redirect("/login?invalid-credentials=true");
			}
			request.logIn(user, (err) => {
				if (err) { return next(err); }
				if (user.role === "admin") {
					return response.redirect("/admin");
				}
				return response.redirect(redirectTo);
			});
		});
		authenticator(request, response, next);
	}

	oauth2Authenticator(provider, options) {
		return (request, response, next) => {
			const redirectTo = request.session.redirectTo || "/";
			delete request.session.redirectTo;

			const state = redirectTo ? Buffer.from(JSON.stringify({ redirectTo })).toString("base64") : undefined;
			const authenticator = passport.authenticate(provider, { ...options, state });
			authenticator(request, response, next);
		};
	}

	oauth2Callback() {
		return (request, response) => {
			const { state } = request.query;
			const { redirectTo } = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
			console.log(redirectTo);
			if (typeof redirectTo === "string") {
				return response.redirect(redirectTo);
			}
			return response.redirect("/");
		};
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

            const res = await api.post(`/register`, {
                username: email,
                password: password,
            });

            const userToLogin = JSON.parse(JSON.stringify(user));

            userToLogin.paymentToken = res.data.token;

            request.login(userToLogin, async (error) => {
                if (error) {
                    return response.render("pages/auth/register", {
                        errorMsg: "Đăng ký thất bại. Vui lòng thử lại.",
                    });
                }
                if (cartData) {
                    try {
                        const cartItems = JSON.parse(cartData);
                        for (let i = 0; i < cartItems.length; i++) {
                            const cartItem = cartItems[i];
                            await CartItemService.addCartItem(
                                request.user.userId,
                                cartItem.productId,
                                cartItem.quantity
                            );
                        }
                    } catch (error) {
                        console.error("Error syncing cart data:", error);
                        return response.status(500).send("Error syncing cart data");
                    }
                }
                response.redirect("/");
            });
        } catch (error) {
            if (error instanceof ModelError) {
                return response.render("pages/auth/register", {
                    errorMsg: "Email đã tồn tại. Vui lòng sử dụng email khác.",
                });
            } else if (error instanceof AxiosError) {
                console.error("Error registering payment account:", error);
                return response.render("pages/auth/register", {
                    errorMsg: "Đăng ký thất bại. Vui lòng thử lại.",
                });
            }
            throw new Error(error);
        }
    }

	async afterLogin(request, response) {
		const { cartData } = request.body;
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
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }

	successRedirect(request, response) {
		response.redirect("/");
	}
}

export default new AuthController();
