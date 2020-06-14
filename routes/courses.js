const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getCourses,
  getOneCourse,
  addCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getOneCourse);
//router.route('/:id').get(getOneCourse).post(addCourse)

module.exports = router;
