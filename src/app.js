//@internal module
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const { actorRoute, authRoute, itemRoute } = require("./routes/init");
const { apiSecure } = require("./middlewares/init");
const dotenv = require('dotenv').config();

module.exports = async(app) => {

    app
        .use(cors())
        .use(express.json({ limit : '50mb' }))
        .use(express.urlencoded({ extended : false }));

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "API is healthy"
        });
    });
    
    // Apply API security middleware to all routes
    app
        .use(apiSecure.apiAuth)
        .use("/api/auth", authRoute)
        .use("/api/actors", actorRoute)
        .use("/api/items", itemRoute)

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });

};