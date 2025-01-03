import UserService from "../services/user.service.js";
import { AuthenticationError } from "../utils/error.js";

class AuthController {
	loginView(_request, response) {
		return response.render("pages/auth/login", { error: null });
	}

	registerView(_request, response) {
		return response.render("pages/auth/register");
	}

	loginErrorHandle(error, _request, response, _next) {
		if (error && error instanceof AuthenticationError) {
			response.render(
				"pages/auth/login", 
				{ errorMsg: "Email hoặc mật khẩu của bạn không đúng. Xin vui lòng thử lại." }
			);
		}
		response.redirect("/");
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

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }
}

export default new AuthController();