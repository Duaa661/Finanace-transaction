const Record = require("../models/record.model");

// CREATE record model structure
exports.createRecord = async (req, res) => {
    try {
        const record = await Record.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating record" });
    }
};

// GET with filter
exports.getRecords = async (req, res) => {
    try {
        const { type, category } = req.query;

        const filter = { user: req.user._id };
        if (type) filter.type = type;
        if (category) filter.category = category;

        const records = await Record.find(filter);
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching records" });
    }
};

// UPDATE
exports.updateRecord = async (req, res) => {
    try {
        const record = await Record.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating record" });
    }
};

// DELETE
exports.deleteRecord = async (req, res) => {
    try {
        await Record.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record" });
    }
};