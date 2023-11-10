const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const savePowerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    odRightSpherer: {
        type: String,
    },
    odRightCylinder: {
        type: String,
    },
    odRightAxis: {
        type: String,
    },
    osLeftSpherer: {
        type: String,
    },
    osLeftCylinder: {
        type: String,
    },
    osLeftAxis: {
        type: String,
    },
    bifocalPower: {
        type: Boolean,
        default: false,
    },
    biodRightSpherer: {
        type: String,
    },
    biodRightCylinder: {
        type: String,
    },
    biodRightAxis: {
        type: String,
    },
    biosLeftSpherer: {
        type: String,
    },
    biosLeftCylinder: {
        type: String,
    },
    biosLeftAxis: {
        type: String,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("savePower", savePowerSchema)