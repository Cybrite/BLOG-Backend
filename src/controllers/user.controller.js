import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);
  const { username, name, email, password } = req.body;
  console.log({
    username,
    name,
    email,
    password: password ? "exists" : "missing",
  });

  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (username.trim() === "") {
    throw new ApiError(400, "Username cannot be empty");
  }
  if (email.trim() === "") {
    throw new ApiError(400, "Email cannot be empty");
  }
  if (name.trim() === "") {
    throw new ApiError(400, "Name cannot be empty");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    name,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});
