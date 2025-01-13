import { AxiosError } from "axios";
import api from "../config/api.js";
import CartItemService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import { ModelError } from "../utils/errors.js";

class AuthController {
    loginView(request, response) {
        if (request.isAuthenticated()) {
            return response.render("pages/auth/authenticated");
        }
        const errorMsg = request.query["invalid-credentials"]
            ? "Email hoặc mật khẩu bạn nhập không chính xác. Xin vui lòng thử lại."
            : null;
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
        const { name, email, password,cartData } = request.body;
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

    async postLogin(req, res) {
        const { redirectUrl, cartData } = req.body;
        if (cartData) {
            try {
                const cartItems = JSON.parse(cartData);
                for (let i = 0; i < cartItems.length; i++) {
                    const cartItem = cartItems[i];
                    await CartItemService.addCartItem(
                        req.user.userId,
                        cartItem.productId,
                        cartItem.quantity
                    );
                }
            } catch (error) {
                console.error("Error syncing cart data:", error);
                return res.status(500).send("Error syncing cart data");
            }
        }
        res.redirect(redirectUrl);
    }

    // status(request, response) {
    // 	return request.user ? response.json(request.user) : response.sendStatus(401);
    // }
}

export default new AuthController();
