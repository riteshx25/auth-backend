import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  // 1. get user detailes from front end
  // 2. user validation
  // 3. check if user already exist: username and email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinary, avatar
  // 6. create user object - create entry in db
  // 7. remove  passsowrd and refresh token fields from the response
  // 8. check for user creation
  // 9. return response to front end

  const { username, email, fullname, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All flelds are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new ApiError(409, "Username already exists");
    }

    if (existingUser.email === email) {
      throw new ApiError(409, "Email already exists");
    }
  }

  console.log("files", req.files);

  const avatarLocalPatth = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPatth) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPatth);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url,
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
