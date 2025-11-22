import {
  getAllUsers,
  searchByEmail,
  searchByUsername,
  findByEmail,
  findByUsername,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../services/user.service.js";

export const getAll = async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json(users);
};

export const getUsersByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const users = await searchByUsername(username);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const users = await searchByEmail(email);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await findByUsername(username);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findByEmail(email);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  const id = req.params.id;
  try {
    const updated = await updateUserById(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMe = async (req, res) => {
  const id = req.params.id;
  await deleteUserById(id);
  res.status(200).json({ message: "User deleted" });
};
