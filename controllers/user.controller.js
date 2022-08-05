const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { registerUserValidator } = require("../utils/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Desc     =>  Login the user
// Access   =>  Private
// Method   =>  POST
// Route    =>  /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if credentials are given
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all the credentials");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    //   generate token and add in the cookie
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 3600 * 24),
      httpOnly: true,
    });

    res.status(200).json({ success: true, data: user });
  } else {
    res.status(400);
    throw new Error("Record not found");
  }
});

// Desc     =>  Register a user
// Access   =>  Public
// Method   =>  POST
// Route    =>  /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  //   check if user already exists
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  //   check if all the fields are given
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all credentials");
  }

  //   validation check
  if (registerUserValidator(name, email, password)) {
    throw new Error("Please provide valid credentials");
  }

  //   hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(200).json({ success: true, data: user });
});

// Desc     =>  Logout a user
// Access   =>  Private
// Method   =>  GET
// Route    =>  /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Signed out" });
});

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
};
