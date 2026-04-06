const express = require("express")
const authRouter = require("./routes/auth.route.js")
const accountRouter = require("./routes/account.route.js")
const transactionRoutes = require("./routes/transaction.route.js")
const dashboard = require("./routes/dashboard.route.js")
const Record=require("./routes/record.route.js")
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
app.use("/api/accounts", accountRouter)
/**
 * - User Record Routes Api Call
 */
app.use("/api/records", Record);
/**
 * - User Dashboard Routes Api Call
 */
app.use("/api/dashboard",dashboard );

app.use("/api/transaction", transactionRoutes)

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})
module.exports=app