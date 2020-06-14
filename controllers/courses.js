const ErrorResponse = require("../utils/ErrorResponse");
const Course = require("../models/Course");

// @desc GET courses
// @route /api/v1/courses
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = async (req, res, next) => {
    let query;

    if(req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
}


// @desc GET a single course
// @route /api/v1/:courseId
// @access Public

exports.getOneCourse = async (req, res, next) => {
    const id = req.params.id

    const course = await Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(
          new ErrorResponse(`Course with id ${id} not found`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: course
    })
}