Red Tetris
Version : 0.1.0
Description : Red Tetris est une application de jeu Tetris multijoueur en temps réel, développée en utilisant les technologies modernes de JavaScript. Le projet utilise React pour l’interface utilisateur, Redux pour la gestion d’état, socket.io pour la communication en temps réel, et Immutable.js pour garantir l’immutabilité des données dans Redux.

Étapes de réalisation
1. Initialisation du projet avec Create React App
Création de la structure de base avec create-react-app.
Mise en place de l’environnement de développement avec Webpack, Babel, et Jest.
Création d’un fichier .gitignore pour exclure les fichiers sensibles et spécifiques au développement.
2. Configuration des variables d’environnement
Ajout d’un fichier .env pour les variables sensibles, comme les URL des serveurs.
Test de l’accès aux variables d’environnement dans l’application.
3. Installation des dépendances principales
Ajout des dépendances côté client : react, redux, react-redux, redux-promise, react-router-dom, immutable, lodash, socket.io-client.
Ajout de socket.io côté serveur pour la communication en temps réel.
Ajout des dépendances de développement pour le test et la compatibilité avec Babel.
Structure actuelle du projet
Le projet est structuré de la manière suivante :

bash
Copier le code
red-tetris/
├── client/               # Contient le code côté client (React, Redux, etc.)
├── server/               # Contiendra le code côté serveur (socket.io, Express)
├── tests/                # Contiendra les tests unitaires et d'intégration
├── .env                  # Variables d'environnement
├── .gitignore            # Fichiers et dossiers ignorés par Git
├── package.json          # Déclaration des dépendances et scripts
└── README.md             # Documentation du projet
Scripts disponibles
yarn start : Démarre l’application en mode développement.
yarn build : Crée un build optimisé pour la production.
yarn test : Lance les tests configurés avec Jest.
yarn eject : Expose la configuration complète (non recommandé pour le moment).
Prochaine étape
La prochaine étape du projet est la mise en place du serveur Node.js avec socket.io pour la communication en temps réel entre les clients.
