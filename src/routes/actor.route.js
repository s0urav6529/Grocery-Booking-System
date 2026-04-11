const actorRoute = require("express").Router();

actorRoute.get("/", (req, res) => {
    res.send("Actor Route");
});

module.exports = actorRoute;