const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  items: [],
  subtotal: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
