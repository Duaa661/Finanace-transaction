const Record = require("../models/record.model");

exports.getSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const records = await Record.find({ user: userId });

        let income = 0;
        let expense = 0;
        const categoryMap = {};

        records.forEach(r => {
            if (r.type === "INCOME") income += r.amount;
            else expense += r.amount;

            categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount;
        });

       return res.json({
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense,
            categoryWise: categoryMap,
            recent: records.slice(-5)
        });

    } catch (error) {
       return  res.status(500).json({ message: "Error generating dashboard" });
    }
};