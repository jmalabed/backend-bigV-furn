const mongoose = require("mongoose");

const furnSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  finish: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  company: { type: String, requried: true },
  imgUrl: { type: String, required: true },
  size: {
    height: Number,
    width: Number,
    units: String,
  },
  specifications: [],
});

const Furniture = mongoose.model("Furniture", furnSchema);

module.exports = Furniture;
