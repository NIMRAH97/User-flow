const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      status: "error",
      message: "Token must be present",
    });
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const usr = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(usr.userId).lean();
    if (user === null) {
      return res.status(401).send({
        status: "error",
        message: "Unauthorized User",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "error",
      message: "Invalid Token",
    });
  }
};

module.exports = { authenticate };
