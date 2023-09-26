const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "this is the title",
        content: "this is the description",
        imageUrl: "images/happy.jpeg",
        creator: {
          name: "Dennis",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");

    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  //TODO create in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/happy.jpeg",
    creator: {
      name: "Dennis",
    },
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post has been created",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
