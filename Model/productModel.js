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
  name: {
    type: String,
    required: true,
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
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  pricewithlense: {
    type: Number,
  },
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
  soldPrice: {
    type: Number,
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
  shape: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "shapeStyle",
  },
  style: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "shapeStyle",
  },
  stock: {
    type: Number,
    required: ["Please Enter Stock"],
    default: 1,
  },
}, { timestamps: true });
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
