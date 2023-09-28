const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authToken = req.get("Authorization");

  if (!authToken) {
    const err = new Error("Unauthenticated");
    err.statusCode = 401;
    throw err;
  }

  const token = authToken.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "SomesecuredSalt123");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const err = new Error("Unathenticated");
    err.statusCode = 401;
    throw err;
  }

  req.userId = decodedToken.userId;
  next();
};
