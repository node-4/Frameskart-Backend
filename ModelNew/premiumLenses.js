const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        description: {
            type: Array,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("premiumlense", faqSchema);