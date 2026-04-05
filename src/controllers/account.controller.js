const accountModel = require("../models/account.model")


async function createAccountController(req, res){
    try {
        const user = req.user;
    
    if (!user) {
        return res.status(404).json({message:"User Id Not Found"})
    }
    const account = await accountModel.create({
        user:user._id
    })
    return res.status(201).json(account)
    } catch (error) {
         return res.status(401).json({message:"Server Error"})
    }
}
module.exports = {
    createAccountController
}