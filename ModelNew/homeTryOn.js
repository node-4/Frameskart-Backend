const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    address1: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("homeTryOn", faqSchema);