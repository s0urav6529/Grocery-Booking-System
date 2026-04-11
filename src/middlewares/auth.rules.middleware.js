const { body } = require("express-validator");
const { validateAndNormalizeContact } = require("../utils/contact.utils");

const createAuthRules = [
    body("contact")
        .trim()
        .notEmpty()
        .withMessage("Contact is required")
        .custom((value) => {
          const validation = validateAndNormalizeContact(value);
          if (!validation.valid) {
            throw new Error(
              "Invalid Contact"
            );
          }
          return true;
        })
        .customSanitizer((value) => {
          const validation = validateAndNormalizeContact(value);
          return validation.normalized;
        }),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords do not match");
          }
          return true;
        }),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(['admin', 'user'])
        .withMessage("Role must be either 'admin' or 'user'")
];

const loginRules = [
    body("contact")
        .trim()
        .notEmpty()
        .withMessage("Contact is required")
        .custom((value) => {
          const validation = validateAndNormalizeContact(value);
          if (!validation.valid) {
            throw new Error(
              "Invalid Contact"
            );
          }
          return true;
        })
        .customSanitizer((value) => {
          const validation = validateAndNormalizeContact(value);
          return validation.normalized;
        }),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

module.exports = { createAuthRules, loginRules };