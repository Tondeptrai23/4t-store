import UserService from "../services/user.service.js";

class AuthController {
	loginView(request, response) {
		const errorMsg = request.query["invalid-credentials"] 
			? "Email hoặc mật khẩu bạn nhập không chính xác. Xin vui lòng thử lại." 
			: null;
		return response.render("pages/auth/login", { errorMsg: errorMsg });
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
				if (error) { throw new Error(error); }
				response.redirect("/");
			});
		}
		catch (error) {
			throw new Error(error);
		}
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }
}

export default new AuthController();