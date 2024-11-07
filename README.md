# Red Tetris

**Version :** 0.1.0

**Description :**
Red Tetris est une application de jeu Tetris multijoueur en temps réel, développée en utilisant les technologies modernes de JavaScript. Le projet utilise React pour l’interface utilisateur, Redux pour la gestion d’état, socket.io pour la communication en temps réel, et Immutable.js pour garantir l’immutabilité des données dans Redux.

## Étapes de réalisation

### 1. Initialisation du projet avec Create React App

- Création de la structure de base avec create-react-app.
- Mise en place de l’environnement de développement avec Webpack, Babel, et Jest.
- Création d’un fichier `.gitignore` pour exclure les fichiers sensibles et spécifiques au développement.

### 2. Configuration des variables d’environnement

- Ajout d’un fichier `.env` pour les variables sensibles, comme les URL des serveurs.
- Test de l’accès aux variables d’environnement dans l’application.

### 3. Installation des dépendances principales

- Ajout des dépendances côté client : `react`, `redux`, `react-redux`, `redux-promise`, `react-router-dom`, `immutable`, `lodash`, `socket.io-client`.
- Ajout de socket.io côté serveur pour la communication en temps réel.
- Ajout des dépendances de développement pour le test et la compatibilité avec Babel.

## Structure actuelle du projet

red-tetris/
├── client/ # Contient le code côté client (React, Redux, etc.)
├── server/ # Contiendra le code côté serveur (socket.io, Express)
├── tests/ # Contiendra les tests unitaires et d'intégration
├── .env # Variables d'environnement
├── .gitignore # Fichiers et dossiers ignorés par Git
├── package.json # Déclaration des dépendances et scripts
└── README.md # Documentation du projet

## Scripts disponibles

- `yarn start` : Démarre l’application en mode développement.
- `yarn build` : Crée un build optimisé pour la production.
- `yarn test` : Lance les tests configurés avec Jest.
- `yarn eject` : Expose la configuration complète (non recommandé pour le moment).

### 4. Mise en place du serveur Node.js avec socket.io

- Création du serveur avec **Express** pour servir les fichiers statiques et gérer les connexions socket.io.
- Configuration d'un script pour démarrer le serveur sur le port 4000.
- Test de la connexion entre le client React et le serveur en temps réel.

### 5. Configuration de BrowserRouter pour le routage côté client

- Intégration de **BrowserRouter** dans `src/index.js` pour permettre le routage.
- Création des composants `Home` et `GameRoom` pour les pages principales.
- Ajout des routes `/` et `/room/:roomId` dans `App.js` pour la navigation.
- Test du routage pour accéder aux pages d'accueil et de salle de jeu.

### 6. Mise en place de Redux pour la gestion de l’état global

- Configuration de **Redux** avec `@reduxjs/toolkit` pour la gestion de l’état.
- Ajout de `redux-promise` comme middleware pour les actions asynchrones.
- Création d’un reducer de test utilisant **Immutable.js** pour garantir l’immutabilité.
- Vérification de l'affichage du message provenant de Redux dans `App.js`.

### 7. Création de l'interface utilisateur de base avec React

- Création du composant `GameGrid` pour afficher la grille de jeu Tetris (10x20).
- Création du composant `PlayerList` pour afficher la liste des joueurs connectés.
- Intégration de `GameGrid` et `PlayerList` dans la page `GameRoom`.
- Test de l'affichage de la page de salle de jeu avec la grille et les joueurs fictifs.
