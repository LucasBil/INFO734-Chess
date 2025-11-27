# Rapport d'avancement - Projet INFO734 Chess

## 1. Vue d'ensemble
Le projet **INFO734-Chess** vise à développer une application de jeu d'échecs en ligne complète (Full Stack). L'architecture repose sur une séparation claire des responsabilités :
- **Frontend** : Vue 3 avec Vite pour l'interface utilisateur.
- **Backend** : Node.js avec Express pour l'API REST (gestion utilisateurs et parties).
- **Base de données** : MongoDB pour la persistance des données.
- **Infrastructure** : Orchestration via Docker Compose.

L'objectif est de fournir une expérience de jeu fluide, avec gestion de compte, historique de parties et jeu en temps réel et éventuellement un système de jeu solo.

## 2. État d'avancement par module

### 2.1 Frontend (`chess/`)
**État : Avancé (sur Master)**
- Interface utilisateur fonctionnelle (Plateau, Profil, Navigation).
- Moteur de jeu (règles) côté client.
- *Note :* L'intégration avec le Backend pour l'authentification (Login/Register) reste à faire côté client (actuellement mocké).

### 2.2 Backend (`backend/`)
**État : Très Avancé (sur la branche `backend`)**
La branche `backend` implémente solidement l'API REST, de manière structurée (Architecture Services/Controllers) :
- **Authentification & Sécurité** :
    - Système complet Login/Register avec JWT (Access & Refresh Tokens).
    - Middleware de protection des routes (`auth.middleware.js`).
    - Gestion des rôles (Admin vs User).
- **Gestion des Utilisateurs** : Modèle complet avec Avatar et historique de tokens.
- **Gestion des Parties (Historique)** :
    - Modèle `Game` stockant les joueurs (White/Black), le résultat, et la liste des coups (FEN + Timestamp).
    - API CRUD complète : Créer une partie, Lister les parties d'un joueur, Ajouter un coup, etc.
- **Documentation** : Intégration de Swagger pour documenter l'API.

### 2.3 Infrastructure
**État : Fonctionnel**
- Configuration Docker Compose pour tous les services (y compris MongoDB et Mongo Express).

## 3. Synthèse et Prochaines Étapes
La structure générale du projet est bien avancé. La prochaine étape sera de gérer un système de multijoueur avec des websockets. Peut-être également implementer un système de jeu solo contre des bots de niveaux différents.

### Points Clés
- **Authentification** : Le backend est PRÊT. Il faut maintenant connecter le formulaire de login du Frontend à l'API (`/auth/login`) au lieu d'utiliser le mock local.
- **Historique des parties** : Le backend permet de sauvegarder les parties. Il faut s'assurer que le serveur WebSocket ou le Frontend appelle l'API Backend pour enregistrer le résultat et les coups à la fin d'un match.

## 4. Conclusion
Le backend est bien architecturé. La priorité est maintenant l'intégration Front-Back ainsi qu'implémenter les idées mentionnées au-dessus.
