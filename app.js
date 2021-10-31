const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const { authenticate } = require("./middleware/authentication");
const productRoutes = require("./api/products/product");
const userRoutes = require("./api/user/user");
mongoose.connect(process.env.MONGO_DB, () => {
  console.log("Mongo DB connected");
});
app.use(express.json());
app.use(morgan("dev"));

app.use("/product", authenticate, productRoutes);
app.use("/user", userRoutes);
app.use((req, res) => {
  return res.status(404).json({
    message: "Page Not found",
  });
});
// app.use("/", (req, res) => {
//   res.send("Server is running");
// });
module.exports = app;
