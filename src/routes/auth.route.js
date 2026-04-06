const express = require("express")
const authController=require("../controllers/auth.controller.js")
const authMiddleware=require("../middlewares/auth.middleware.js")
const router = express.Router()

// POST /api/auth/register
router.post("/register",authController.userRegisterController)
router.post("/login",authController.userLoginController)

router.post('/logout', authMiddleware.authMiddleware, authController.userLogoutController)
module.exports=router