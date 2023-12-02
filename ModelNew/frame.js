const mongoose = require("mongoose");

const frameSchema = new mongoose.Schema({
        name: {
                type: String,
        },
        image: {
                type: String
        },
},
        { timestamps: true }
);

module.exports = mongoose.model("frame", frameSchema);