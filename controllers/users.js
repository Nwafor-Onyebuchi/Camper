const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Get all user
exports.getUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ success: true, data: users });
};

// Get a user
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};

// Create a user
exports.createUser = async (req, res, next) => {
  try {
    console.log("ok");
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findOneAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse(`${error}`, 500));
  }
};
