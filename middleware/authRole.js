const ROLE = require('../config/roles');

const authAdmin = (req,res,next) => {
    try {
        if(!req.role === ROLE.ADMIN) {
            return res.status(401).json({msg: "Unauthorized access"});
        }
        next();
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

const authUser = (req,res,next) => {
    try {
        if(!req.role === ROLE.USER) {
            return res.status(401).json({msg: "Unauthorized access"});
        }
        next();
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

module.exports = {authAdmin,authUser};