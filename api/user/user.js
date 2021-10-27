const express = require("express");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Already registered",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
            });
            // console.log(req.body.password);
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// router.post("/login", (req, res) => {
//   User.findOne({ username: req.body.username })
//     .exec()
//     .then((user) => {
//       if (user.length < 1) {
//         console.log(user);
//         return res.status(401).json({
//           message: "Auth failed",
//         });
//       } else {
//         bcrypt.compare(req.body.password, user[0].password, (err, res) => {
//           if (err) {
//             return res.status(401).json({
//               message: "Auth failed",
//             });
//           }
//           if (result) {
//             return res.status(200).json({
//               message: "Success",
//             });
//           }
//           res.status(401).json({
//             message: "Auth failed",
//           });
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).exec();

  console.log(user);
  if (user.length < 1) {
    return res.status(401).json({
      message: "Auth failed",
    });
  } else {
    const compare = await bcrypt.compare(req.body.password, user.password);
    console.log(compare);
    console.log(user);

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
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  //   const id = req.params.id;
  const removeUser = await User.findByIdAndDelete(id);
  if (removeUser) {
    return res.status(200).json({
      message: "Deleted",
    });
  }
  return res.status(404).json({
    message: "Not found ",
  });
});
// router.delete("/:id", (req, res) => {
//   const id = req.params.id;
//   User.findByIdAndDelete(id)
//     .exec()
//     .then(() => {
//       res.status(200).json({
//         message: "Deleted",
//       });
//     })
//     .catch((err) => {
//       res.status(404).json({
//         error: err,
//       });
//     });
// });
module.exports = router;
