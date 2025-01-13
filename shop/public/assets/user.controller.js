import userService from "../../services/user.service.js";

class UserController {
    async getAll(req, res, next) {
        res.json(userService.getAll());
    }

    async getAllDb(req, res, next) {
        res.json(await userService.getAllInDb());
    }

    getProfile(req, res, next) {
        const user = req.user;
        const isLoggedIn = req.isAuthenticated();
        res.render("index", { body: "pages/profile", user, isLoggedIn });
    }

    async updateProfile(req, res, next) {
        const user = req.user;
        const updatedUser = await userService.update(user.userId, req.body);
        res.json(updatedUser);
    }
}

export default new UserController();
