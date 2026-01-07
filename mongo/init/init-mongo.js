// Cette script sera exécuté automatiquement au premier démarrage

// Obtenir la base de données admin pour l'authentification
db = db.getSiblingDB('admin');

// S'authentifier avec l'utilisateur root
db.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

// Récupérer le nom de la base depuis les variables d'environnement
var databaseName = process.env.MONGO_INITDB_DATABASE;

// Créer et utiliser la base de données spécifiée
db = db.getSiblingDB(databaseName);

// Créer un utilisateur dédié pour cette base
db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: databaseName
    },
    {
      role: 'dbAdmin',
      db: databaseName
    }
  ]
});

// Créer des collections initiales
db.createCollection('users');
db.createCollection('games');

try {
  db.users.insertOne({
    username: "dark",
    email: "dark@admin.local",
    password: "$2b$10$lWzEaCNZc5KJOol77.P8WetTDctDpxdvO.rDEWND6rXoHvoT0t28O", // dark
    role: "admin",
    avatarUrl: null,
    refreshTokens: [],
    createdAt: new Date()
  });
} catch (error) {
  print('Error creating initial admin user: ' + error);
}

print('=== Database initialized successfully ===');
print('Database: ' + databaseName);
print('User: ' + process.env.MONGO_INITDB_ROOT_USERNAME);