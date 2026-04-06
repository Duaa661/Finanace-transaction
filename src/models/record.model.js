// models/record.model.js
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["INCOME", "EXPENSE"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("record", recordSchema);