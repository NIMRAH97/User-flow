const mongoose = require("mongoose");
const ProductPurchase = require("../models/productPurchase");

const getProductHistory = async (req, res) => {
  const { page = 1, size = 3 } = req.query;
  const userID = req.user._id;
  const offset = page && size ? (page - 1) * size : 0;
  const history = await ProductPurchase.find({ userID })
    .limit(parseInt(size))
    .skip(parseInt(offset))
    .populate("productID", "name price");
  if (history) {
    return res.status(200).json(history);
  }
  return res.status(404).json({
    message: "Not found",
  });
};

module.exports = { getProductHistory };
