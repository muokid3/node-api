const { validationResult, Result } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("validation Errors");
    err.statusCode = 422;
    err.errors = errors.array();
    throw err;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPw,
      });

      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Registration successfull!",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let fetchedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error(
          "We could not find a user with the provided email"
        );
        err.statusCode = 401;
        throw err;
      }
      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const err = new Error("Incorrect password");
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id.toString() },
        "SomesecuredSalt123",
        { expiresIn: "1h" }
      );

      res
        .status(200)
        .json({ token: token, userId: fetchedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
