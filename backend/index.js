const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = 3000;

// Middleware pour lire le JSON
app.use(express.json());

connectDB();

// Route test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});