// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remplace par ton URL Mongo
    const conn = await mongoose.connect(process.env.BDD_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Arrête l'application si la connexion échoue
  }
};

module.exports = connectDB;
