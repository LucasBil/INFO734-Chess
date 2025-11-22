import * as GameService from "../services/game.service.js";

export const create = async (req, res) => {
  try {
    const game = await GameService.createGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const games = await GameService.getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGamesByPlayerController = async (req, res) => {
  try {
    const { userId } = req.params;
    const games = await GameService.getGamesByPlayer(userId);
    res.json(games);
  } catch (error) {
    console.error("Error fetching games by player:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const fetchGamesByWhite = async (req, res) => {
  try {
    const { userId } = req.params;
    const games = await getAllGamesByWhite(userId);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchGamesByBlack = async (req, res) => {
  try {
    const { userId } = req.params;
    const games = await getAllGamesByBlack(userId);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const game = await GameService.getGameById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const game = await GameService.updateGame(req.params.id, req.body);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const game = await GameService.deleteGame(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ message: "Game deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMove = async (req, res) => {
  try {
    const move = { fen: req.body.fen, date: new Date() };
    const game = await GameService.addMoveToGame(req.params.id, move);

    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
