exports.getBootcamps = (req, res) => {
  res.status(200).json({
    success: true,
    msg: "Get all bootcamps"
  });
};

exports.getOneBootcamp = (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    success: true,
    msg: `Get a single bootcamp with id of ${id}`
  });
};

exports.createBootcamp = (req, res) => {
  //const id = req.params.id
  res.status(200).json({
    success: true,
    msg: `Create a new bootcamp`
  });
};

exports.updateBootcamp = (req, res) => {
  const id = req.params.id
  res.status(200).json({
    success: true,
    msg: `Update a camp with id of ${id}`
  });
};

exports.deleteBootcamp =  (req,res)=>{
    const id = req.params.id
    res.status(200).json({success: true, msg: `Bootcapm ${id} has been deleted`})
}