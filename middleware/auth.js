const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

//Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access this resource", 401)
    );
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    req.user = await User.findById(decoded.id);
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
  }
};
