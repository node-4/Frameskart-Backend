const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ["shape", "style"],
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("shapeStyle", bannerSchema);