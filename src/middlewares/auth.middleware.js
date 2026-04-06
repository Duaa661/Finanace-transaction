const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel=require("../models/blacklist.model")


async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access, Token Missing" });
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({ token })
    if (isBlacklisted) {
        return res.status(401).json({
            message:"Token is Expired"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
async function authSystemiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access, Token Missing" });
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({ token })
    if (isBlacklisted) {
        return res.status(401).json({
            message:"Token is Expired"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // fetch the system user using token
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user) {
        return res.status(401).json({
        message: "User not found"
       });
        }
        if (!user.systemUser) {
            return res.status(403).json({
                message:"Forbidden access, not a system user"
            })
        }
        req.user = user;
        return next()
    } catch (error) {
        return res.status(401).json({
         message:"Unauthorized Access,token is invalid"
     })
    }
}

module.exports = {
    authMiddleware,
    authSystemiddleware
};