const ErrorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamps");

exports.getBootcamps = async (req, res, next) => {
  try {
    let query;

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    //console.log(queryStr);
    query = Bootcamp.find(JSON.parse(queryStr))
    const bootcamps = await query;
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

exports.getOneBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
      );

      // res.status(404).json({
      //   success: false
      // });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    // res.status(404).json({
    //   success: false,
    //   message: "Not found"
    // });
  }
};

exports.createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      //message: `Error: ${error}`
    });
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: "Update failed",
      });
    }

    res.status(200).json({
      success: true,
      msg: `Document was successfully updated ${id}`,
      data: bootcamp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `ERROR: ${error}`,
    });
  }
};

exports.deleteBootcamp = async (req, res) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: "Cannot delete",
      });
    }

    res.status(200).json({
      success: true,
      msg: `Delete successfull: ${id}`,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `ERROR: ${error}`,
    });
  }
};
