import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middlewares/error.js";

// this function can be used for admin login to get all the user's data
export const getAllUsers = async (req, res) => { };

// login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(new ErrorHandler("User dooesn't exist with this email", 401));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Wrong Password", 400));
    sendCookie(user, res, `Welcom Back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

// register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return next(new ErrorHandler("User already exist with this email", 400));
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

// get users profile
export const getMyProfile = (req, res) => {
  res.status(200).json({
    succes: true,
    user: req.user,
  });
};

// logout
export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expire: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "Logged Out Succesfully",
      user: req.user,
    });
};
