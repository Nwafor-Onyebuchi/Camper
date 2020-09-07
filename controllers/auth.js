const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");
const ErroResponse = require("../utils/ErrorResponse");
const { options, use } = require("../routes/auth");
const sendEmail = require("../utils/sendEmail");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// Get logged in user
exports.getMe = async (req, res, next) => {
  // console.log(req.user.id);
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });

  // next();
};

// Get logged in user
exports.forgotPassword = async (req, res, next) => {
  // console.log(req.user.id);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `${req.body.email} has not been registered on the platform`,
        404
      )
    );
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You (or someone else) requested to reset your password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    const options = {
      email: user.email,
      subject: "Reset password token",
      message,
    };
    await sendMail(options);
    return res
      .status(200)
      .json({ success: true, messge: "Email sent!", data: options });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Could not send email", 500));
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 404));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send response with cookies
  senTokenResponse(user, 200, res);
};
