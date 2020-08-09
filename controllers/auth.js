const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

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
