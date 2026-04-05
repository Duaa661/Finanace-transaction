const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const createAccountController=require("../controllers/account.controller")
const router = express.Router()
/** 
 * - POST /api/account
 * - Create a new Account
 * - Protected Route
*/
router.post("/",authMiddleware.    authMiddlware
,createAccountController.createAccountController)
// router.post()



module.exports=router