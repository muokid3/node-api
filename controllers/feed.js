exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "this is the title", desc: "this is the description" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const desc = req.body.desc;

  //TODO create in DB

  res
    .status(201)
    .json({
      message: "Post has been created",
      post: { id: new Date().toISOString(), title: title, desc: desc },
    });
};
