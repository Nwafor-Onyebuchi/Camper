const ErrorResponse = require("../utils/ErrorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamps");

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


// @desc Add a single course
// @route POST /api/v1/bootcamps/bootcampId/courses
// @access Private

exports.addCourse = async (req, res, next) => {
    req.body.bootcamp  = req.params.bootcampId
    const id = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(id)
    if (!bootcamp) {
        return next(
          new ErrorResponse(`Bootcamp with id ${id} not found`, 404)
        );
    }

    const course = await Course.create(req.body)
    
    res.status(200).json({
        success: true,
        data: course
    })
}