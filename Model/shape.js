const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("shape", bannerSchema);