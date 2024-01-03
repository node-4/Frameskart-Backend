const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Category Required"],
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ["Active", "Block"],
        default: "Active"
    },
}, { timestamps: true }
);
module.exports = mongoose.model("powerTypeCategory", categorySchema);