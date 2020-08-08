const ErrorResponse = require("../utils/ErrorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamps");

// @desc GET courses
// @route /api/v1/courses
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = async (req, res, next) => {
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
};

// @desc GET a single course
// @route /api/v1/:courseId
// @access Public

exports.getOneCourse = async (req, res, next) => {
  const id = req.params.id;

  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse(`Course with id ${id} not found`, 404));
  }
  res.status(200).json({
    success: true,
    data: course,
  });
};

// @desc Add a single course
// @route POST /api/v1/bootcamps/bootcampId/courses
// @access Private

exports.addCourse = async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const id = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${id} not found`, 404));
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
};

// @desc Update a single course
// @route PUT /api/courses/:id
// @access Private

exports.updateCourse = async (req, res, next) => {
  const id = req.params.id;

  let course = await Course.findById(id);
  if (!course) {
    return next(new ErrorResponse(`Course with id ${id} not found`, 404));
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
};

// @desc Delete a single course
// @route DELETE /api/courses/:id
// @access Private

exports.deleteCourse = async (req, res, next) => {
  const id = req.params.id;

  const course = await Course.findById(id);
  if (!course) {
    return next(new ErrorResponse(`Course with id ${id} not found`, 404));
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
};
