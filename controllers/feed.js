const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");

    error.statusCode = 422;
    throw error;
  }

  console.log(req.file);

  if (!req.file) {
    const error = new Error("Image is missing");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;

  console.log(image);

  const filePath = image.path;

  //create in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: filePath,
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

exports.getPost = (req, res, next) => {
  const id = req.params.postId;

  Post.findById(id)
    .then((post) => {
      if (!post) {
        const err = new Error("Post not found");
        err.statusCode = 404;
        throw err;
      }

      res.status(200).json({
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
