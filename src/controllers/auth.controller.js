const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken");
const emailService=require("../services/email.service.js")
/**
 * -  User Register Controller
 * - POST /api/auth/register
*/

async function userRegisterController(req, res)  {
    const { name, email, password } = req.body;
    console.log(name,email)
    const isExists = await userModel.findOne({
        email: email
    })
    // user already Exist
    if (isExists) {
        return res.status(422).json({ message: "User already exist with email",status:"failed" },)
    }
    
    // create a new account
    const user = await userModel.create({
        name,email,password
    })
    // Generate a toen for user id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn:"3d"
    })
    console.log(token)

    // set token in cookie
    res.cookie("token", token)
    res.status(201).json({
        user: {
            _id: user._id,
            name:user.name,
            email: user.email,
        }, token
    })
      await emailService.sendRegisterEmail(user.email,user.name)
}
/**
 * - Login Controller
 * - POST api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body;
    // password not send using email because usermodel use select false so password not find
    // Using select find password
    const user=await userModel.findOne({email}).select("+password")
    if (!user) {
        return res.status(401).json({
             message:"Email or Password is Invalid"
         })
    }
    // check password is match or not
    const validPassword = await user.comparePassword(password)
    if (!validPassword) {
        return res.status(401).json({
            message:"Email or Password is Invalid"
        })
    }
    // Generate a toen for user id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn:"3d"
    })
    console.log(token)

    // set token in cookie
    res.cookie("token", token)
    res.status(200).json({
        user: {
            _id: user._id,
            name:user.name,
            email: user.email,
        }, token
    })

}

module.exports = {
    userRegisterController,
    userLoginController
}