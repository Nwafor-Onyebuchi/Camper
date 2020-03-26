const express = require("express");

const router = express.Router();

const {
  getBootcamps,
  getOneBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcamp");

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getOneBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
