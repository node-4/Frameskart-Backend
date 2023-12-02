const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;
const subscriptionSchema = mongoose.Schema(
        {
                plan: {
                        type: String,
                        enum: ["SILVER", "GOLD"]
                },
                price: {
                        type: Number,
                },
                month: {
                        type: Number,
                        default: 0
                },
                discount: {
                        type: Number,
                        default: 0
                },
                details: {
                        type: Array,
                },
                discription: {
                        type: String,
                },
        },
        {
                timestamps: true,
        }
);
module.exports = mongoose.model("subscription", subscriptionSchema);




