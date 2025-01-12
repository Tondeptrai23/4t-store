import userService from "../services/user.service.js";

class UserController {
    async getAll(req, res, next) {
        res.json(userService.getAll());
    }

    async getAllDb(req, res, next) {
        res.json(await userService.getAllInDb());
    }

      async getUsers(req, res) {
            try {
                const requestQuery = req.query; // Lấy các tham số từ query string
                console.log("get users " + JSON.stringify(requestQuery));
                const result =
                    await userService.getFilteredSortedAndPaginatedUsers(requestQuery); 
    
                // Trả về kết quả
                res.status(200).json({
                    success: true,
                    data: result,
                });
            } catch (error) {
                console.error("Error fetching users:", error.message);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch users.",
                });
            }
        }
}

export default new UserController();
