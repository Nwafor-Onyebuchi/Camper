const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");
const ErroResponse = require("../utils/ErrorResponse");
const { options } = require("../routes/auth");

// Register a user
exports.register = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    const user = await User.create({
      name,
      email,
      role,
      password,
    });

    // Send response with cookies
    senTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};

// Login a user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!email || !password) {
      return next(
        new ErroResponse("Please provide an email and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErroResponse("Invalid credentials", 401));
    }

    // Check if passwords match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErroResponse("Invalid credentials", 401));
    }

    // Send response with cookies
    senTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};

// Get token from model, create cookie and send response
const senTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
