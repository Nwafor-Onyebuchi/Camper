const ErrorResponse = require("../utils/ErrorResponse");
const Bootcamp = require("../models/Bootcamps");

exports.getBootcamps = async (req, res, next) => {
  try {
    let query;
    // Make a copy of req query
    const reqQuery = {...req.query}

    //Fields to exclude
    const fieldsToRemove = ['select', 'sort', 'page', 'limit'];

    // Loop over all fields and delete fieldsToRemove
    fieldsToRemove.forEach(param=>delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    
    // Find resources
    query = Bootcamp.find(JSON.parse(queryStr))
    
    // Select fields
    if(req.query.select){
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    // Sort fields
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else{
      query = query.sort('createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)
    // Execute query
    
    const bootcamps = await query;

    //Pagination result
    const pagination = {}

    if(endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if(startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }


    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
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
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: "Cannot delete",
      });
    }

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
