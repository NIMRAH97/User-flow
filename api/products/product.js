const express = require("express");
const mongoose = require("mongoose");
const {
  GET_PRODUCT,
  POST_PRODUCT,
  GET_PRODUCT_BY_ID,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} = require("../../controller/product");

const Product = require("../../models/product");

const router = express.Router();

router.get("/", GET_PRODUCT);
router.post("/", POST_PRODUCT);
router.get("/:id", GET_PRODUCT_BY_ID);
router.delete("/:id", DELETE_PRODUCT);
router.patch("/:id", UPDATE_PRODUCT);

module.exports = router;
