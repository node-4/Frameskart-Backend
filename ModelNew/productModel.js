const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const productSchema = mongoose.Schema({
  freeShipping: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
  },
  mrp: {
    type: Number,
  },
  tryFramesAtHome: {
    type: Number,
  },
  image: {
    type: String
  },
  name: {
    type: String,
  },
  productId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  size: {
    type: Array,
  },
  discountActive: {
    type: Boolean,
    default: false
  },
  discountPer: {
    type: Number,
    default: 0
  },
  features: {
    type: String,
  },
  featuresImage: {
    type: Array,
  },
  specification: {
    type: Array,
  },
  descriptionArray: {
    type: Array,
  },
  category: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subcategory: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Subcategory",
  },
  color: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "colorGender",
  },
  gender: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "colorGender",
  },
  brand: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  Style: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Style",
  },
  frameId: {
    type: mongoose.Schema.ObjectId,
    ref: "frame",
  },
  stock: {
    type: Number,
    required: ["Please Enter Stock"],
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ["product", "accessories", "BreakageCoverage"],
    default: "product"
  },
}, { timestamps: true });
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
