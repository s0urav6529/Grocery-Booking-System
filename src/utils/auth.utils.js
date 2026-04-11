const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (payload, secretKey, expiresIn) => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

const verifyToken = (token, secretKey) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

const hashedPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error(`Failed to hash password: ${error.message}`);
    }
};

const verifyPassword = async (inputPassword, hashPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashPassword);
    } catch (error) {
        throw new Error(`Failed to verify password: ${error.message}`);
    }
};

module.exports = { createToken, verifyToken, hashedPassword, verifyPassword };