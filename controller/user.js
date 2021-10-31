const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendEmail } = require("../utils/sendGrid");
const { otpGenerator } = require("../utils/helper");

const postSignUp = async (req, res) => {
  const findUser = await User.find({ username: req.body.username });
  if (findUser.length >= 1) {
    return res.status(409).json({
      message: "Already registered",
    });
  } else {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hash,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      return res.status(500).json({
        message: "User not created",
      });
    }
    return res.status(201).json({
      message: "User Created",
    });
  }
};

const postLogin = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user.length < 1) {
    return res.status(401).json({
      message: "Auth failed",
    });
  } else {
    const compare = await bcrypt.compare(req.body.password, user.password);

    if (compare) {
      const token = jwt.sign(
        {
          username: user.username,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );
      return res.status(200).json({
        message: "Success",
        token: token,
      });
    }
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params; //destructuring
  const removeUser = await User.findByIdAndDelete(id);
  if (removeUser) {
    return res.status(200).json({
      message: "Deleted",
    });
  }
  return res.status(404).json({
    message: "Not found ",
  });
};

const changePassword = async (req, res) => {
  try {
    const {
      body: { oldPassword, newPassword },
    } = req;

    const userOldPassword = req.user.password;

    const compare = await bcrypt.compare(oldPassword, userOldPassword);
    if (!compare) {
      return res.status(403).json({
        message: "Password didn't  match",
      });
    }
    const hashPass = await bcrypt.hash(newPassword, 10);
    if (hashPass) {
      const updatedPassword = await User.findByIdAndUpdate(
        req.user._id,
        { password: hashPass },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "Password updated successfully",
      });
    }
    return res.status(500).json({
      message: "Something went wrong",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const resetPasswordCode = async (req, res) => {
  let otp = otpGenerator();

  const username = req.body.username;
  const user = await User.findOne({ username });
  if (user) {
    await User.findByIdAndUpdate(user._id, { otp });
    await sendEmail("Password reset OTP", otp, "otp");
    return res.status(200).json({
      message: "otp successfully generated",
    });
  }
  return res.status(401).json({
    message: "something went wrong",
  });
};

const resetPassword = async (req, res) => {
  /**
   * FE will click on forget password
   * It will redirect to a form which will be asking for email address
   * A request will be sent to the BE if user exists and store the OTP in the DB
   * The email will contain an OTP code
   * User will enter this OTP in subsequent form
   * Now this OTP will be validated against the OTP of the user in the DB
   * If validated, then we will hash the password and store in the DB
   * /reset-password-code-generator and /reset-password
   *
   */
  try {
    const {
      body: { username, newPassword, otp },
    } = req;
    const user = await User.findOne({ otp, username });
    if (!user) {
      return res.status(403).json({
        message: "OTP not matched",
      });
    }
    const hashPass = await bcrypt.hash(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      user._id,
      { password: hashPass, otp: "" },
      { new: true }
    );
    if (updatedPassword) {
      return res.status(200).json({
        message: "Password reset",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      message: "something went wrong",
    });
  }
};

module.exports = {
  postSignUp,
  postLogin,
  deleteUser,
  changePassword,
  resetPassword,
  resetPasswordCode,
};
