const apiAuth = async (req, res, next) => {

    try {
        const apiKey = req.header("api-secure-key");

        if (!apiKey) {
            return res.status(401).json({ message: "Access denied! No api-secure-key provided." });
        }

        if (apiKey !== process.env.API_SECURE_KEY) {
            return res.status(403).json({ message: "Invalid api-secure-key!" });
        }

        next();

    } catch (error) {
        console.error("API middleware error:", error);
        return res.status(500).json({ error, message: "Internal server error during API authentication!" });
    }
};

module.exports = {apiAuth};
