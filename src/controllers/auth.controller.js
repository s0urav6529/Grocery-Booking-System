const AuthService = require('../services/auth.service');
const { asyncHandler, response } = require('../utils/init');

class AuthController {
  /**
   * Signup endpoint handler
   * Delegates business logic to AuthService
   */
  static signup = asyncHandler(async (req, res) => {
    const { contact, password, role } = req.body;
    const result = await AuthService.signup(contact, password, role);
    return response.sendSuccess(res, 201, 'Signup successful', result);
  });

  /**
   * Login endpoint handler
   * Delegates business logic to AuthService
   */
  static login = asyncHandler(async (req, res) => {
    const { contact, password } = req.body;
    const result = await AuthService.login(contact, password);
    return response.sendSuccess(res, 200, 'Login successful', result);
  });
}

module.exports = AuthController;
