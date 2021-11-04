const express = require("express");
const {
  getProduct,
  postProduct,
  getProductByID,
  deleteProduct,
  updateProduct,
  postProductPurchase,
} = require("../../controller/product");

const router = express.Router();

router.get("/", getProduct);
router.post("/", postProduct);
router.get("/:id", getProductByID);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);
router.post("/purchase", postProductPurchase);
module.exports = router;
