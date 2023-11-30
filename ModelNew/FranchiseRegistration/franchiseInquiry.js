const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        location: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("FranchiseInquiry", faqSchema);