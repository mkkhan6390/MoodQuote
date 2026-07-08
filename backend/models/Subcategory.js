const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  subcategoryId: { type: String, required: true, unique: true },
  subcategoryName: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  categoryAccent: { type: String, required: true },
  categoryIcon: { type: String, required: true },
  quotes: {
    type: Map,
    of: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
        source: { type: String, default: "" },
        type: { type: String, enum: ["verified", "inspired"], default: "verified" }
      }
    ]
  }
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
