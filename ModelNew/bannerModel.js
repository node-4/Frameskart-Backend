const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    link: {
        type: String
    },
    type: {
        type: String,
        enum: ["Top", "Bottom", "Middle", "ProductPage", "tryGlasses", "ContactLens"],
    },
}, { timestamps: true });
module.exports = mongoose.model("Banner", bannerSchema);