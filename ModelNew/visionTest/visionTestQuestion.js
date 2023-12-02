const mongoose = require("mongoose");
const schema = mongoose.Schema;
const visionTestQuestionSchema = new mongoose.Schema({
        question: {
                type: String,
        },
        image: {
                type: String,
        },
        options: [{
                type: String,
        }],
        answer: {
                type: String,
        },
        visionTestId: {
                type: schema.Types.ObjectId,
                ref: "visionTest",
        },
}, { timestamps: true });
module.exports = mongoose.model("visionTestQuestion", visionTestQuestionSchema);