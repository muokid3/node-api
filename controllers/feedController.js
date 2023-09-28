const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.countDocuments()
    .then((total) => {
      totalItems = total;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({
          posts: posts,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        });
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const err = new Error("Image is missing");
    err.statusCode = 422;
    throw err;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Post not found");
        err.statusCode = 404;
        throw err;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post has been updated",
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Post not found");
        err.statusCode = 404;
        throw err;
      }

      //check logged in user

      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Post has been deleted successfully!",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};