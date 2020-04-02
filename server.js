const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require('./middleware/errors')
const bootcapms = require("./routes/bootcamps");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

app.use(morgan("dev"));

app.use("/api/v1/bootcamps", bootcapms);

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
