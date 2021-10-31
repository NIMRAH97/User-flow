const crypto = require("crypto");
require("dotenv").config();

const otpGenerator = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

module.exports = { otpGenerator };
