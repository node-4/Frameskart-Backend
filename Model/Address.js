const mongoose = require("mongoose");
const schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
    address: {
        type: String,
    },
    apartment: {
        type: String,
    },
    landmark: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    name: {
        type: String,
    },
    mobile: {
        type: String,
    },
    altMobile: {
        type: String,
    },
    type: {
        type: String,
        enum: ["home", "office", "other"],
    },
    default: {
        type: Boolean,
        default: false,
    },
    user: {
        type: schema.Types.ObjectId,
        ref: "user",
    },
}, { timestamps: true });
module.exports = mongoose.model("Address", addressSchema);