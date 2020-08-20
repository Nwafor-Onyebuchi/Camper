const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamps");

exports.getBootcamps = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
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
    console.log(error);
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
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: "Cannot delete",
      });
    }

    bootcamp.remove();

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

exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: "Error uploading file",
      });
    }

    if (!req.files) {
      return next(new ErrorResponse("Please select a photo", 400));
    }
    const file = req.files.file;
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    if (req.files.size > process.env.MAX_FILE_UPLOAD_SIZE) {
      return next(
        new ErrorResponse(
          "File size limit exceeded. File size limit is 1MB",
          400
        )
      );
    }

    // Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return next(new ErrorResponse("Error uploading file", 500));
      }
      await Bootcamp.findByIdAndDelete(id, { photo: file.name });
      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `ERROR: ${error}`,
    });
  }
};
