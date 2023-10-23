const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name access Required"],
    },
    price: {
        type: Number,
    },
    image: {
        type: String
    },

});

module.exports = mongoose.model("accessories", accessSchema);