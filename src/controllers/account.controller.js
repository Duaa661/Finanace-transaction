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

async function getUserAccountController(req,res) {
    const accounts = await accountModel.find({ user: req.user._id });
    return res.status(200).json({accounts})
}

async function getbankBalanceController() {
    const { accountId } = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user:req.user._id
    })
    if (!account) {
        return res.status(404).json({
            message:"Account Not found"
        })
    }
    const balance = await account.getBalance();
    return res.status(200).json({
        accountId: account._id,
        balance:balance
    })
}
module.exports = {
    createAccountController,
    getUserAccountController,
    getbankBalanceController
}