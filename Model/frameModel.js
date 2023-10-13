const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name frame Required"],
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

module.exports = mongoose.model("Frame", frameSchema);