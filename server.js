const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan')
const bootcapms = require("./routes/bootcamps");
dotenv.config({ path: "./config/config.env" });

const app = express();


 if(process.env.NODE_ENV ==='development') {
     app.use(morgan('dev'))
 }

// const logger = (req, res, next) => {
//     console.log(
//         `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     )

//     next()
// }

app.use(morgan('dev'))

app.use("/api/v1/bootcamps", bootcapms);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
