import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;
  console.log(req.body);

  if (
    { username, name, email, password }.some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError("All fields are required", 400);
  }

  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters", 400);
  }

  const alreadyRegistered = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (alreadyRegistered) {
    throw new ApiError("User already registered", 405);
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    name,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError("Something went wrong", 500);
  }

  return res
    .status(201)
    .json(ApiResponse(201, "User registered successfully", createdUser));
});
