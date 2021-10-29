const express = require("express");
require("dotenv").config();
const {
  postSignUp,
  deleteUser,
  postLogin,
  changePassword,
} = require("../../controller/user");
const { authenticate } = require("../../middleware/authentication");
const router = express.Router();

router.post("/signup", postSignUp);
router.post("/login", postLogin);
router.delete("/:id", deleteUser);
//change password
router.patch("/update", authenticate, changePassword);

module.exports = router;
