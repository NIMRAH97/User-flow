const mongoose = require("mongoose");

const Product = require("../models/product");
const ProductPurchase = require("../models/productPurchase");

const getProduct = async (req, res) => {
  const { page, size } = req.query;
  const offset = page && size ? (page - 1) * size : 0;
  let next = false;
  const nextCheck = page * size || 0; // next page exists or not
  const totalCount = await Product.count();
  if (nextCheck < totalCount) {
    next = true;
  }

  const product = await Product.find()
    .limit(parseInt(size) || 5)
    .skip(parseInt(offset))
    .sort("-createdAt")
    .select("name price _id");

  if (product) {
    const response = {
      count: totalCount,
      currentPage: page,
      next,
      product: product.map((pro) => ({
        name: pro.name,
        price: pro.price,
        _id: pro._id,
        request: {
          type: "GET",
          url: `http://localhost:3001/product/${pro._id}`,
        },
      })),
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
      product,
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

const postProductPurchase = async (req, res) => {
  const {
    body: { prodID, quantity },
  } = req;

  const promises = []; // array

  prodID.forEach((el) => {
    const productPurchase = new ProductPurchase({
      userID: req.user._id,
      productID: el,
      quantity,
    });

    promises.push(productPurchase.save());
  });
  const result = await Promise.all(promises);

  if (!result) {
    return res.status(403).json({
      message: "Something went wrong while fetching product history",
    });
  }
  return res.status(200).json(result);
};
module.exports = {
  getProduct,
  postProduct,
  deleteProduct,
  updateProduct,
  getProductByID,
  postProductPurchase,
};
