const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getCourses,
  getOneCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Courses = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

//Bring in protect middleware
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Courses, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, addCourse);

router
  .route("/:id")
  .get(getOneCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
