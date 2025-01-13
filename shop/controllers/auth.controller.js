import { AxiosError } from "axios";
import passport from "passport";
import api, { generateToken } from "../config/api.js";
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

        return response.render("pages/auth/login", {
            errorMsg: errorMsg,
            query: request.query,
        });
    }

    registerView(request, response) {
        if (request.isAuthenticated()) {
            return response.render("pages/auth/authenticated");
        }
        return response.render("pages/auth/register", { errorMsg: null });
    }

    changePasswordView(request, response) {
        if (!request.isAuthenticated()) {
            return response.redirect("/login");
        }
        return response.render("index", {
            body: "pages/auth/change-password",
            isLoggedIn: true,
        });
    }

    async changePassword(request, response) {
        if (!request.isAuthenticated()) {
            return response.redirect("/login");
        }

        const { currentPassword, newPassword } = request.body;

        const user = await UserService.findById(request.user.userId);

        if (!user) {
            return response.status(404).json({ success: false });
        }

        const isPasswordValid = await UserService.validatePassword(
            user,
            currentPassword
        );

        if (!isPasswordValid) {
            return response.status(401).json({ success: false });
        }

        await UserService.updatePassword(user.userId, newPassword);

        request.logout((error) => {
            if (error) {
                throw new Error(error);
            }
            response.redirect("/login?password-changed=true");
        });
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
        let redirectTo = request.session.redirectTo || "/";
        if (
            redirectTo.includes("/change-password") ||
            redirectTo.includes("/login")
        ) {
            redirectTo = "/";
        }
        delete request.session.redirectTo;

        const authenticator = passport.authenticate(
            "local",
            (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return response.redirect("/login?invalid-credentials=true");
                }
                request.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    if (user.role === "admin") {
                        return response.redirect("/admin");
                    }
                    return response.redirect(redirectTo);
                });
            }
        );
        authenticator(request, response, next);
    }

    oauth2Authenticator(provider, options) {
        return (request, response, next) => {
            let redirectTo = request.session.redirectTo || "/";
            if (
                redirectTo.includes("/change-password") ||
                redirectTo.includes("/login")
            ) {
                redirectTo = "/";
            }
            delete request.session.redirectTo;

            const state = redirectTo
                ? Buffer.from(JSON.stringify({ redirectTo })).toString("base64")
                : undefined;
            const authenticator = passport.authenticate(provider, {
                ...options,
                state,
            });
            authenticator(request, response, next);
        };
    }

    oauth2Callback(request, response) {
        const { state } = request.query;
        const { redirectTo } = JSON.parse(
            Buffer.from(state, "base64").toString("utf-8")
        );
        if (typeof redirectTo === "string") {
            return response.redirect(redirectTo);
        }
        return response.redirect("/");
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
            provider: "local",
        };

        try {
            const user = await UserService.create(data);

            const res = await api.post(
                `/register`,
                {
                    username: email,
                },
                {
                    headers: {
                        "x-server-token": generateToken(),
                    },
                }
            );

            const userToLogin = JSON.parse(JSON.stringify(user));

            userToLogin.paymentToken = res.data.token;

            request.login(userToLogin, async (error) => {
                if (error) {
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
