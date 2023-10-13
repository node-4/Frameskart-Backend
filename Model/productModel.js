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
  type: {
    type: String,
        enum: ["Sunglasses", "Computer Glass", "Premium", "App"],
        required: true,
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
 
},{ timestamps: true });
// productSchema.plugin(mongoosePaginate);
// productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
