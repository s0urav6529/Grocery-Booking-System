const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * Signup endpoint handler
   * Delegates business logic to AuthService
   */
  static async signup(req, res) {
    try {
      const { contact, password, role } = req.body;

      // Call service to handle signup
      const result = await AuthService.signup(contact, password, role);

      return res.status(201).json({
        success: true,
        message: 'Signup successful',
        data: result
      });
    } catch (error) {
      console.error('Signup error:', error);

      // Handle service errors
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Login endpoint handler
   * Delegates business logic to AuthService
   */
  static async login(req, res) {
    try {
      const { contact, password } = req.body;

      // Call service to handle login
      const result = await AuthService.login(contact, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);

      // Handle service errors
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
