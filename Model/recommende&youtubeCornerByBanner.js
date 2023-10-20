const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema({
        link: {
                type: String,
        },
        label: {
                type: String,
        },
        image: {
                type: String
        },
        type: {
                type: String,
                enum: ["Recommended", "youtubeCorner"],
        },
        status: {
                type: String,
                enum: ["Active", "Block"],
                default: "Active"
        },
});

module.exports = mongoose.model("recommende&youtubeCornerByBanner", frameSchema);