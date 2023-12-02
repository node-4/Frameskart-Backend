const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate")
const SubcategorySchema = new mongoose.Schema({
        logoImage: {
                type: String,
        },
        name: {
                type: String
        },
        powerTypeCategoryId: {
                type: mongoose.Schema.ObjectId,
                ref: "powerTypeCategory",
        },
        powerTypeSubCategoryId: {
                type: mongoose.Schema.ObjectId,
                ref: "powerTypeSubCategory",
        },
        frameId: {
                type: mongoose.Schema.ObjectId,
                ref: "frame",
        },
        productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
        },
        feature: {
                type: Array,
        },
        coating: {
                type: Array,
        },
        price: {
                type: Number,
                default: 0
        },
        topSelling: {
                type: Boolean,
                default: false,
        },
        withInDay: {
                type: Number,
                default: 0
        }
})

SubcategorySchema.plugin(mongoosePaginate);
SubcategorySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("lens", SubcategorySchema);