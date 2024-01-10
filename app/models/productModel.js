const mongoose = require('mongoose')

const ProductsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Products", ProductsSchema);
