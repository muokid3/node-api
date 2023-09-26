const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Contol-Allow-Origin", "*");
  res.setHeader("Access-Contol-Allow-Methods", "GET< POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Contol-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);

//global error handling
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({
    message: message,
  });
});
mongoose
  .connect(
    "mongodb+srv://nodeuser:iv6ieHXdBfWww79R@cluster0.eyesdhv.mongodb.net/blog"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
