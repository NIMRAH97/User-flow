const express = require("express");

const router = express.Router();

const productHistory = require("../../controller/productHistory");

router.get("/product", productHistory.getProductHistory);

module.exports = router;
