const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        image: {
            type: Array,
        },
        description: {
            type: Array,
        },
        totalCamp: {
            type: Number,
            default: 0
        },
        totalTest: {
            type: Number,
            default: 0
        },
        applicationTitle: {
            type: Number,
            default: 0
        },
        applicationDescription: {
            type: Array,
        },
        type: {
            type: String,
            enum: ["form", "Data"]
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        organisation: {
            type: String,
        },
        websiteUrl: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("eyeTestCamp", faqSchema);