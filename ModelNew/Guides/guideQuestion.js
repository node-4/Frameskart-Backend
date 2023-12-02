const mongoose = require("mongoose");
const guidesTypeSchema = new mongoose.Schema(
        {
                guideId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "guide",
                },
                question: {
                        type: String,
                },
                answer: {
                        type: String,
                },
                image: {
                        type: String,
                },
        },
        { timestamps: true }
);

module.exports = mongoose.model("guideQuestion", guidesTypeSchema);