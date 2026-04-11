const { validationResult } = require("express-validator");

const validate = async(req, res, next) => {

    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const formattedErrors = errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            }));
            return res.status(400).json({ errors: formattedErrors });
        }
        else{
            next();
        }
    } catch (error) {
        return res.status(400).json({ error,message:"Error during validation !" });
    }
}

module.exports = { validate };
