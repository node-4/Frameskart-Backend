const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        link: {
            type: String,
        },
        label: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("franchiseTestimonial", faqSchema);