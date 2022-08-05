const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/logout", protect, logoutUser);

module.exports = { userRouter };
