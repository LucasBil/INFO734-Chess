import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getAllUsers = () => {
  return User.find().select("-password -refreshTokens");
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
