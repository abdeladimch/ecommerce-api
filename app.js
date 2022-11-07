require("express-async-errors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./db/connect");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler.js");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const reviewRouter = require("./routes/review");
const orderRouter = require("./routes/order");
const upload = require("express-fileupload");

const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");

const express = require("express");
const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(upload());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

connectDB(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("Connected to DB!");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
