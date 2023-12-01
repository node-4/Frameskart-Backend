const mongoose = require("mongoose");
const visionTestSchema = new mongoose.Schema(
        {
                image: {
                        type: String,
                },
                name: {
                        type: String,
                },
                instruction: [{
                        image: {
                                type: String,
                        },
                        name: {
                                type: String,
                        },
                }]
        },
        { timestamps: true }
);

module.exports = mongoose.model("visionTest", visionTestSchema);