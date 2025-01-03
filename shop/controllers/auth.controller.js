import UserService from "../services/user.service.js";

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
			if (error) { throw new Error(error); }
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

		const user = UserService.create(data).catch((error) => {
			response.render("pages/auth/register", { 
				errorMsg: "Email đã tồn tại. Vui lòng sử dụng email khác." 
			});
		});
		request.login(user, (error) => {
			if (error) { 
				response.render("pages/auth/register", { 
					errorMsg: "Đăng ký thất bại. Vui lòng thử lại." 
				}); 
			}
			else {
				response.redirect("/");
			}
		});
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }
}

export default new AuthController();