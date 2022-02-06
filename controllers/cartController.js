const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

//build routes out.

// get all carts tested
router.get("/", async (req, res, next) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// get specific cart tested
router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const foundCart = await Cart.findOne({ owner: userId });
    res.status(200).json(foundCart);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// create cart tested
router.post("/", async (req, res, next) => {
  try {
    const cartThings = req.body;
    const createdCart = await Cart.create(cartThings);
    res.status(200).json(createdCart);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// edit cart tested
router.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const edits = req.body;
    const editedCart = await Cart.updateOne({ owner: userId }, edits, {
      new: true,
    });
    res.status(200).json(editedCart);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// delete cart tested
router.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedCart = await Cart.findOneAndDelete({ owner: userId });
    res.status(200).json(deletedCart);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

module.exports = router;
