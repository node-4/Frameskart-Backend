const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name series Required"],
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ["Active", "Block"],
        default: "Active"
    },
});

module.exports = mongoose.model("Series", seriesSchema);