const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

//build routes out.
// get all carts
router.get("/", async (req, res, next) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});
// get all in cart
router.get("/:cartId", async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const foundCart = await Cart.findById(id);
    res.status(200).json(foundCart);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// edit cart
router.put("/:cartId", async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const edits = req.body;
    const editedCart = await Cart.findByIdAndUpdate(cartId, edits, {
      new: true,
    });
    res.status(200).json();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// delete cart
router.get("/", async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

module.exports = router;
