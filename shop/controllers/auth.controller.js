
class AuthController {
	loginView(_request, response) {
		return response.render("pages/login");
	}

	registerView(_request, response) {
		return response.render("pages/register");
	}

	logout(request, response) {
		request.logout((error) => {
			if (error) { throw new Error(error); }
			response.redirect("/");
		});
	}

	// status(request, response) {
	// 	return request.user ? response.json(request.user) : response.sendStatus(401);
	// }
}

export default new AuthController();