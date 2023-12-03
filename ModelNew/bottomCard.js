const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema({
        name: {
                type: String,
        },
        image: {
                type: String
        },
        type:{
            type: String,
            enum:["EyeTestAtHome","FrameTryonAthome","BuyAtStore","BreakageCoverage"]
        }
},
        { timestamps: true }
);

module.exports = mongoose.model("bottomCard", frameSchema);