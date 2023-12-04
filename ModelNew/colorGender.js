const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
        name: {
                type: String,
        },
        image: {
                type: String,
        },
        type: {
                type: String,
                enum: ["color", "Gender"],
        },
},
        { timestamps: true }

);

module.exports = mongoose.model("colorGender", accessSchema);