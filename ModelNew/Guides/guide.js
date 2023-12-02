const mongoose = require("mongoose");
const guidesTypeSchema = new mongoose.Schema(
        {
                image: {
                        type: String,
                },
                name: {
                        type: String,
                },
                bannerImage: {
                        type: String,
                },
        },
        { timestamps: true }
);

module.exports = mongoose.model("guide", guidesTypeSchema);