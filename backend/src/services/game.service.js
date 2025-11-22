import Game from "../models/game.model.js";

export const createGame = async (data) => {
  return await Game.create(data);
};

export const getAllGames = async () => {
  return await Game.find().populate("white black", "username email role");
};

export const getGamesByPlayer = async (userId) => {
  return await Game.find({
    $or: [
      { white: userId },
      { black: userId }
    ]
  }).populate("white black", "username email");
}

export const getAllGamesByWhite = async (userId) => {
  return await Game.find({ white: userId })
    .populate("white", "username email")
    .populate("black", "username email");
};

export const getAllGamesByBlack = async (userId) => {
  return await Game.find({ black: userId })
    .populate("white", "username email")
    .populate("black", "username email");
};

export const getGameById = async (id) => {
  return await Game.findById(id).populate("white black", "username email role");
};

export const updateGame = async (id, data) => {
  return await Game.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGame = async (id) => {
  return await Game.findByIdAndDelete(id);
};

export const addMoveToGame = async (id, move) => {
  return await Game.findByIdAndUpdate(
    id,
    { $push: { moves: move } },
    { new: true }
  );
};
