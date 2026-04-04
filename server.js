const app = require("./src/app")
require("dotenv").config();
const connectoDb=require("./src/config/db")
app.listen(3000, () => {
    console.log("Server is running on Port 3000")
})