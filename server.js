const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/errors");
const bootcamps = require("./routes/bootcamps");
const connectDB = require("./config/db");
const courses = require("./routes/courses");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const users = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mongo prevent noSql injection
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Cross origin resource sharing
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 2,
});
// app.use(limiter()); // Not working

// Prevent http param pollution
app.use(hpp());

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
app.use("/api/v1/users", users);

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
