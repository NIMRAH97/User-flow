const mongoose = require("mongoose");

const productPurchase = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    quantity: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductPurchase", productPurchase);
