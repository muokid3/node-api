const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/authController");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid E-Mail")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("name").trim().not().isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
    authController.signup);
  
router.post("/login", authController.login);

module.exports = router;
