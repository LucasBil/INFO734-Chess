import Game from "../models/game.model.js";

export const createGame = async (data) => {
  return await Game.create(data);
};

export const getAllGames = async () => {
  return await Game.find().populate("white black", "username email role");
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
