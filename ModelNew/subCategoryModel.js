const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
  },
  image: {
    type: String
  },
  type: {
    type: String,
    enum: ["ComputerGlasses", "ContactLenses", "Sunglasses","other"],
},
})

module.exports = mongoose.model("Subcategory", SubcategorySchema);