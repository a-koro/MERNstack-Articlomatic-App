const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {

    try {
        const token = req.header("x-auth-token");
        if(!token) {
            return res.status(401).json({msg: "No authentication token found"});
        }

        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifiedToken) {
            return res.status(401).json({msg: "Token not valid"});
        }
        req.user = verifiedToken.id;
        req.role = verifiedToken.role;
        next();
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

module.exports = auth;