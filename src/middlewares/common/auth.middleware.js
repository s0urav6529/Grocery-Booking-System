const { auth } = require("../../utils/init");

/**
 * @desc Check if the user is logged in
 */
const isLogin = async(req,res,next) => {
    
    try {

        let token = req.get('Authorization');

        if(token){
            token = token.split(' ')[1];
            token = auth.verifyToken(token, process.env.JWT_SECRET);

            if(token){
                req.account = token;
                next();
            }
            else {
                res.status(401).json({ message: "Unauthorized access" });
            }
        }else{
            res.status(401).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized access" });
    }
}


/**
 * @desc Require admin role
 */
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.account.userType !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
};

module.exports = { requireAdmin, isLogin };
