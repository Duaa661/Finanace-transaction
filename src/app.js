const express = require("express")
const authRouter = require("./routes/auth.route.js")
const accountRouter = require("./routes/account.route.js")
const transactionRoutes=require("./routes/transaction.route.js")
const cookieParser=require("cookie-parser")
const app = express()

app.use(express.json())
app.use(cookieParser())
/**
 * - User Routes Api Call
 */
app.use("/api/auth", authRouter)

/**
 * - User Account Routes Api Call
 */
app.use("/api/accounts",accountRouter)

app.use("/api/transaction",transactionRoutes)
module.exports=app