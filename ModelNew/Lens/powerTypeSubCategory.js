const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "powerTypeCategory",
  },
  name: {
    type: String,
  },
})

module.exports = mongoose.model("powerTypeSubCategory", SubcategorySchema);