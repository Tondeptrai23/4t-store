import userService from "../services/user.service.js";

class UserController {
    async getAll(req, res, next) {
        res.json(userService.getAll());
    }

    async getAllDb(req, res, next) {
        res.json(await userService.getAllInDb());
    }

}

export default new UserController();
