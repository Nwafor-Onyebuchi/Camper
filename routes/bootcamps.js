const express = require("express");

const router = express.Router();

const {
  getBootcamps,
  getOneBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

const Bootcamp = require("../models/Bootcamps");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resourse routes
router.use("/:bootcampId/courses", courseRouter);
router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getOneBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
