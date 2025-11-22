import mongoose from "mongoose";

const MoveSchema = new mongoose.Schema({
  fen: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const GameSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, },
  white: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  black: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  moves: { type: [MoveSchema], default: [] },
  result: String, // draw, white, black
  createdAt: { type: Date, default: Date.now, },
});

export default mongoose.model("Game", GameSchema);