const app = require("./src/app")
const connectDb=require("./src/config/db.js")
require("dotenv").config();
const connectoDb=require("./src/config/db")
app.listen(3000, () => {
     connectDb()
    console.log("Server is running on Port 3000")
})