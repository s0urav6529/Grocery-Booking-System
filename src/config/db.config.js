//@external module
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

//@exports
module.exports = async () => {
    try {

        // checking connection
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();

        // handle events
        pool.on("error", (err) => {
            console.error("Unexpected error on idle client", err);
            process.exit(1);
        });

        return pool;

    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};