const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");
const ErroResponse = require("../utils/ErrorResponse");

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

    // Create token
    const token = user.getSignedJWTToken();

    res.status(200).json({ success: true, token });
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

    // Create token
    const token = user.getSignedJWTToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};
