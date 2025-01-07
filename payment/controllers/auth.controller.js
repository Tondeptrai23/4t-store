class AuthController {
    login(req, res) {
        res.status(200).send("Login Success");
    }
}

export default new AuthController();
