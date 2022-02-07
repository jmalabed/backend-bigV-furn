const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Furniture = require("../models/furniture");
const {
  createUserToken,
  requireToken,
  handleValidateOwnership,
} = require("../middleware/auth");

const furnUrl = "http://localhost:9000/furniture";

// get routes
// get all tested
router.get("/", async (req, res, next) => {
  try {
    const allFurn = await Furniture.find({});
    res.status(200).json(allFurn);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});
//  get one - tested, error working through URL spaces with title.. work with ID for now?
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const foundFurn = await Furniture.findById(id);
    res.status(200).json({ foundFurn });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});
//  get all from category tested
router.get("/type/:type", async (req, res, next) => {
  try {
    const type = req.params.type;
    const allFurnType = await Furniture.find({ type });
    res.status(200).json(allFurnType);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// put route
router.put("/:id", async (req, res, ext) => {
  try {
    const id = req.params.id;
    const updatedFurn = await Furniture.findOne({ _id: id });
    res.status(200).json({ updatedFurn });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// post route
router.post("/", async (req, res, next) => {
  try {
    const newFurn = req.body;
    const createdFurn = await Furniture.create(newFurn);
    res.status(200).json({ createdFurn });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});
// delete route
router.delete("/", async (req, res, next) => {
  try {
    console.log("hit route");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
