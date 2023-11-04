const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartProductsSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false })
const cartServiceSchema = new Schema({
    accessoriesId: {
        type: Schema.Types.ObjectId,
        ref: "accessories"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false })
const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    suggesstion: {
        type: String,
    },
    products: {
        type: [cartProductsSchema]
    },
    accessories: {
        type: [cartServiceSchema]
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null,
    },
    couponUsed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("cart", CartSchema)