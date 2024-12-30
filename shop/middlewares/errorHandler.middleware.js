import { StatusCodes } from "http-status-codes";

export default function errorHandler(err, req, res, next) {
	console.log(err);
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		success: false,
		error: "ServerError",
		message: err.message,
	});
}
