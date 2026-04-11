const authRoute = require('express').Router();
const { AuthController } = require('../controllers/init');
const { authRules, validation } = require('../middlewares/init');

authRoute
    .post('/signup', authRules.createAuthRules, validation.validate, AuthController.signup)
    .post('/login', authRules.loginRules, validation.validate, AuthController.login)

module.exports = authRoute;
