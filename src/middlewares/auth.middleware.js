const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")


async function authMiddlware(req, res, next) {
    // check token in cookies or header section exist or not
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message:"Unauthorized Access,Token is Missing"})
    }
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)
        
        req.user = user;
        next()

    } catch (error) {
        return res.status(401).json({message:"Unauthorized Access,Token is Invalid"})
    }
}

module.exports = {
    authMiddlware
}