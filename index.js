//@external modules
const express = require("express");
const App = require("./src/app");

const app = express();

const startServer = async() => {

    await App(app);

    app.listen(process.env.PORT,() => {
        console.log(`App listening in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
    });
};

//@start server
startServer();