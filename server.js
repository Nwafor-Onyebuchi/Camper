const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/errors");
const bootcamps = require("./routes/bootcamps");
const connectDB = require("./config/db");
const courses = require("./routes/courses");
const fileupload = require("express-fileupload");
const auth = require("./routes/auth");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

app.use(morgan("dev"));

// Uploading photo
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
