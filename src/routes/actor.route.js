const { authMiddleware } = require("../middlewares/init");

const actorRoute = require("express").Router();

actorRoute.use(authMiddleware.isLogin)

actorRoute.post("/", (req, res) => {
    console.log("Actor details", req.account);
    res.send("Actor details", req.account);
});

module.exports = actorRoute;