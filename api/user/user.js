const express = require("express");
require("dotenv").config();
const {
  postSignUp,
  deleteUser,
  postLogin,
  changePassword,
  resetPassword,
  resetPasswordCode,
} = require("../../controller/user");

const { authenticate } = require("../../middleware/authentication");

const router = express.Router();

router.post("/signup", postSignUp);
router.post("/login", postLogin);
router.delete("/:id", deleteUser);
router.patch("/reset", resetPassword);
// change password
router.patch("/reset-code", resetPasswordCode);
router.patch("/update", authenticate, changePassword);

module.exports = router;
