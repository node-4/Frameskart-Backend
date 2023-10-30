const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");
// const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
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
    ref: "shape",
  },
  style: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "shape",
  },
  stock: {
    type: Number,
    required: ["Please Enter Stock"],
    default: 1,
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

}, { timestamps: true });
// productSchema.plugin(mongoosePaginate);
// productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
