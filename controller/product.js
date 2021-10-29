const mongoose = require("mongoose");
const Product = require("../models/product");

const getProduct = async (req, res) => {
  const product = await Product.find().select("name price _id");
  if (product) {
    const response = {
      count: product.length,
      product: product.map((product) => {
        return {
          name: product.name,
          price: product.price,
          _id: product._id,
          request: {
            type: "GET",
            url: "http://localhost:3001/product/" + product._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  } else {
    res.status(404).json({
      message: "Product not found",
    });
  }
};

const getProductByID = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (product) {
    const response = {
      count: product.length,
      product: product,
    };
    res.status(200).json(response);
  } else {
    res.status(404).json({
      message: "Product not found",
    });
  }
};

const postProduct = async (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  const response = await product.save();
  if (response) {
    res.status(201).json(response);
  } else {
    res.status(400).json({
      message: "Bad Request",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (product) {
    res.status(201).json({
      message: "Product deleted",
    });
  } else {
    res.status(404).json({
      message: "Product not found",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const props = req.body;
  const product = await Product.findByIdAndUpdate(id, props, { new: true });
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(404).json({
      message: "Product not found",
    });
  }
};

module.exports = {
  getProduct,
  postProduct,
  deleteProduct,
  updateProduct,
  getProductByID,
};
