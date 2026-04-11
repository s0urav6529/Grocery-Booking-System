//@internal module
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const { actorRoute } = require("./routes/init");
const dotenv = require('dotenv').config();

module.exports = async(app) => {

    app
        .use(cors())
        .use(express.json({ limit : '50mb' }))
        .use(express.urlencoded({ extended : false }));

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    app.use("/api/actors", actorRoute);

    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "API is healthy"
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });

};