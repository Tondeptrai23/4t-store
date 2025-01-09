import { DeserializeError } from "../utils/errors.js";

export function deserializeHandler(error, request, response, next) {
	if (error && error instanceof DeserializeError) {
		request.logout((error) => {
			if (error) { throw new Error(error); }
			response.redirect("/");
		});
	}
	else {
		next();
	}
}