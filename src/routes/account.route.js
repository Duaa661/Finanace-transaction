const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware.js")
const createAccountController=require("../controllers/account.controller.js")
const router = express.Router()
/** 
 * - POST /api/account
 * - Create a new Account
 * - Protected Route
*/
// router.post()
router.post("/",authMiddleware.authMiddleware,createAccountController.createAccountController)

/** 
 * - GET /api/account
 * - Get all account of the logged-in user
 * - Protected Route
*/
router.get("/",authMiddleware.authMiddleware,createAccountController.getUserAccountController)

/**
 * - GET /api/accounts/balance/:accountId
 */

router.get("/balance/:accountId",authMiddleware.authMiddleware,createAccountController.getbankBalanceController)

module.exports=router