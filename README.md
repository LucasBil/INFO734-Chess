# Projet INFO734 — Site de jeu d'échecs (Full‑stack dynamique)

## Résumé
Projet réalisé dans le cadre du cours INFO734 visant à créer une application web **full‑stack et dynamique**.  
L'application est un **site de jeu d'échecs en ligne** avec :  

- **Frontend** : Vue 3 + Vite, affichage du plateau et interactions utilisateur.  
- **Backend** : Node.js + Express, API REST pour la gestion des utilisateurs, parties, etc.  
- **Communication temps réel** : WebSocket pour le matchmaking et les mouvements de pièces.  
- **Persistance** : MongoDB pour stocker les utilisateurs et parties.  

---

## Architecture et composition

| Service | Description |
|---------|------------|
| `frontend/` | Vite + Vue 3 : interface utilisateur, routes et logique client. |
| `backend/` | Node.js + Express : API REST pour la gestion de la logique serveur. |
| `websocket/` | Serveur Node.js : gestion de la communication temps réel. |
| `mongo/` | MongoDB : données persistées et scripts d'initialisation (`init/init-mongo.js`). |
| `mongo-express` | Interface d'administration MongoDB via Docker. |
| Orchestration | `docker-compose.yml` pour lancer tous les services en local. |

---

## Outils et technologies

- Node.js (image officielle `node:lts`)  
- Vue 3 + Vite  
- Express.js  
- WebSocket (Node.js)  
- MongoDB 6.0  
- Docker & docker-compose  
- JavaScript, HTML, CSS  

---

## Arborescence (extraits)

```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── index.js
└──[...]
chess/ (frontend)
├── public/
├── src/
├── index.html/
└── [...]
mongo/
├── db/ # Données Mongo
└── init/ # Scripts d'initialisation
websocket/
├── server.js
└── package.json
.env
.gitignore
docker-compose.yml
README.md
```

## Commandes utiles

### Lancer l'ensemble avec Docker (recommandé)
```bash
docker-compose up --build
```
```bash
docker-compose down
```
### Lancer chaque service manuellement (développement local)

Frontend :
```bash
cd chess
npm install
npm run dev
```

Backend :
```bash
cd backend
npm install
npm run dev
```

WebSocket :
```bash
cd websocket
npm install
npm start
```

MongoDB : via Docker-compose ou instance locale
## Accès par défaut
| Service       | URL / Port                                     |
| ------------- | ---------------------------------------------- |
| Frontend      | [http://localhost:8080](http://localhost:8080) |
| Backend API   | [http://localhost:3000](http://localhost:3000) |
| WebSocket     | ws://localhost:8081                            |
| Mongodb       | localhost:27017                                |
| Mongo Express | [http://localhost:8083](http://localhost:8083) |

## Variables d'environnement (.env)
```
MODE=development

PORT_WEBSOCKET=8081
PORT_FRONTEND=8080
PORT_BACKEND=3000
PORT_MONGOEXPRESS=8083
PORT_BDD=27017

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

BDD_NAME=chess
BDD_USERNAME=admin
BDD_PASSWORD=admin
```
Les ports et identifiants sont configurables via ce fichier.

Chaine de connection :
> mongodb://${BDD_USERNAME:-root}:${BDD_PASSWORD:-root}@localhost:27017/${BDD_NAME:-app}?authSource=admin

### Remarques

Le dossier mongo/db contient les fichiers de la base de données. Supprimer ces fichiers réinitialise la BDD.

Les volumes Docker sont configurés pour permettre l'édition du code en temps réel sans reconstruire les images.

Pour le développement, assurez-vous que les conteneurs backend et websocket démarrent après la base MongoDB afin d’éviter les problèmes de connexion.