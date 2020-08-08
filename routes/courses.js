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

router
  .route("/")
  .get(
    advancedResults(Courses, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);

router.route("/:id").get(getOneCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
