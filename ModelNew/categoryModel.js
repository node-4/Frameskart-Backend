const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Category Required"],
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ["Main", "FramesKartSmartSeries", "PremiumEyeWear", "PremiumLens", "FramesKartSeries"],
    },
    status: {
        type: String,
        enum: ["Active", "Block"],
        default: "Active"
    },
}, { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);