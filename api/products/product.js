const express = require("express");
const {
  getProduct,
  postProduct,
  getProductByID,
  deleteProduct,
  updateProduct,
} = require("../../controller/product");

const router = express.Router();

router.get("/", getProduct);
router.post("/", postProduct);
router.get("/:id", getProductByID);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);

module.exports = router;
