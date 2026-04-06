const { Router } = require("express")
const authMiddleware = require("../middlewares/auth.middleware.js")
const TransactionController=require("../controllers/transaction.controller.js")

const transactionRoutes = Router();

transactionRoutes.post("/",authMiddleware.authMiddleware,TransactionController.createTransaction)
transactionRoutes.post("/system/initial-funds",authMiddleware.authMiddleware,TransactionController.createIntialFundTransaction)
module.exports=transactionRoutes