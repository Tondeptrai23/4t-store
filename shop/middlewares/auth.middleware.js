import { DeserializeError } from "../utils/errors.js";

export function deserializeHandler(error, request, response, next) {
    if (error && error instanceof DeserializeError) {
        request.logout((error) => {
            if (error) {
                throw new Error(error);
            }
            response.redirect("/");
        });
    } else {
        next();
    }
}

export function isAdmin(request, response, next) {
    if (request.isAuthenticated() && request.user.role === "admin") {
        next();
    } else {
        response.status(403).render("index", {
            body: "error",
            isLoggedIn: request.user ? true : false,
            status: 403,
            message: "Bạn không có quyền truy cập trang này",
            description:
                "Vui lòng đăng nhập với tài khoản admin để truy cập trang này",
        });
    }
}
