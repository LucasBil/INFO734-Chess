import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user", },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);