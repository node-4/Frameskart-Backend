const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        image1: {
            type: String,
        },
        image: {
            type: Array,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("franchise", faqSchema);