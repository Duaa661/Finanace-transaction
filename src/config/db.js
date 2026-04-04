const mongoose = require("mongoose")


function connecttoDB() {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Server is Connected to DB")
    })
        .catch(err => {
            console.log("Error Connecting to DB")
            process.exit(1)
    })
}

module.exports=connecttoDB