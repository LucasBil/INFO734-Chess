import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getAllUsers = () => {
  return User.find().select("-password -refreshTokens");
};

export const searchByUsername = async (username) => {
  const regex = new RegExp(username, "i"); // i = insensitive
  return await User.find({ username: regex }).select("-password -refreshTokens");
};

export const searchByEmail = async (email) => {
  const regex = new RegExp(email, "i");
  return await User.find({ email: regex }).select("-password -refreshTokens");
};

export const findByUsername = async (username) => {
  return await User.findOne({ username }).select("-password -refreshTokens");
};

export const findByEmail = async (email) => {
  return await User.findOne({ email }).select("-password -refreshTokens");
};

export const getUserById = (id) => {
  return User.findById(id).select("-password -refreshTokens");
};

export const updateUserById = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return User.findByIdAndUpdate(id, data, { new: true })
    .select("-password -refreshTokens");
};

export const deleteUserById = (id) => {
  return User.findByIdAndDelete(id);
};
