const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./database/db");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/error.middleware");
const { expenseRouter } = require("./routes/expense.route");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");

// DB connection
connectDB();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/expense", expenseRouter);
app.use("/api/users", userRouter);

// error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
