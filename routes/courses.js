const express = require("express");

const router = express.Router({mergeParams: true});

const {
  getCourses,
  getOneCourse
} = require("../controllers/courses");

router.route('/').get(getCourses)
router.route('/:id').get(getOneCourse)

module.exports = router;