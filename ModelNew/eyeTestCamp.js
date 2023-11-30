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
        },
        totalTest: {
            type: Number,
        },
        applicationTitle: {
            type: String,
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