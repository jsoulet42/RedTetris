// ./server/index.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const handleGameEvents = require("./sockets/gameEvents");
const { players } = require("./game/playerManager");
const { rooms } = require("./game/roomManager");

const {
  movePiece,
  stackPiece,
  clearCompleteLines,
  generateRandomPiece,
} = require("./game/gameLogic");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Pour les tests en local ; ajuster pour des déploiements
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// Vérifier que `rooms` est bien importé
console.log("Imported rooms in index.js:", rooms);

// Gérer les connexions socket.io
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion établie : ${socket.id}`);
  handleGameEvents(socket, io); // Gérer les événements du jeu pour ce socket
});

// Boucle de jeu principale
setInterval(() => {
  // Vérifie si `rooms` est défini
  if (!rooms) {
    console.error("Erreur : `rooms` n'est pas défini !");
    return;
  }

  // Pour chaque room
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    if (room.status !== "in-progress") return; // Ne traiter que les salles en cours

    room.players.forEach((playerId) => {
      const player = players[playerId];
      if (player && player.currentPiece) {
        const newPiece = movePiece(player.currentPiece, "down", player.grid);
        if (newPiece) {
          player.currentPiece = newPiece;
        } else {
          // Empiler la pièce sur la grille
          player.grid = stackPiece(player.grid, player.currentPiece);
          player.currentPiece = generateRandomPiece();
          // Vérifier et supprimer les lignes complètes
          player.grid = clearCompleteLines(player.grid);
          // Mettre à jour le score
          player.score += 100;
        }
        // Émettre l'état du jeu mis à jour uniquement au joueur concerné
        io.to(playerId).emit("gameState", player);
      }
    });
  });
}, 1000); // Chute toutes les secondes

// Lancer le serveur
server.listen(PORT, () => {
  console.log(`Serveur socket.io lancé sur le port ${PORT}`);
});
