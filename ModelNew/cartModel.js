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
}, { _id: false });
const cartLensSchema = new Schema({
    lensId: {
        type: Schema.Types.ObjectId,
        ref: "lens"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false });
const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    suggesstion: {
        type: String,
    },
    products: {
        type: [cartProductsSchema]
    },
    lens: {
        type: [cartLensSchema]
    },
    framesKartAtHomeProductId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    framesKartAtHomeDate: {
        type: Date,
    },
    framesKartAtHomeTime: {
        type: String,
    },
    framesKartAtHomeContact: {
        type: String,
    },
    framesKartAtHomeQuantity: {
        type: Number,
        default: 1
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