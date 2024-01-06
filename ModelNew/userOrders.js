const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const cartProductsSchema = new schema({
  productId: {
    type: schema.Types.ObjectId,
    ref: "Product"
  },
  price: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { _id: false })
const cartLenseSchema = new schema({
  lensId: {
    type: schema.Types.ObjectId,
    ref: "lens"
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  }
}, { _id: false })
const DocumentSchema = schema({
  userId: {
    type: schema.Types.ObjectId,
    ref: "user"
  },
  orderId: {
    type: String
  },
  products: {
    type: [cartProductsSchema]
  },
  lens: {
    type: [cartLenseSchema]
  },
  orderObjTotalAmount: {
    type: String,
  },
  applyCoupan: {
    type: schema.Types.ObjectId,
    ref: "Coupon",
  },
  couponDiscount: {
    type: String,
  },
  orderObjPaidAmount: {
    type: String,
  },
  paymentOption: {
    type: String,
    enum: ["PrePaid", "PostPaid"],
    default: "PrePaid"
  },
  orderStatus: {
    type: String,
    enum: ["unconfirmed", "confirmed", "preparingForDispatch", "onTheWay", "Cancel", "Delivered"],
    default: "unconfirmed",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
DocumentSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("userOrder", DocumentSchema);