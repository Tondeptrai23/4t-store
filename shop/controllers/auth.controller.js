
class AuthController {
  login(request, response) {
    response.json(request.user);
  }

  logout(request, response) {
    request.logout((error) => {
      if (error) { return response.sendStatus(500); }
      return response.sendStatus(200);
    });
  }

  status(request, response) {
    return request.user ? response.json(request.user) : response.sendStatus(401);
  }
}

export default new AuthController();