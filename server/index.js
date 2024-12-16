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

// Fonction pour calculer le score en fonction des lignes supprimées
function computeScore(linesCleared) {
  switch (linesCleared) {
    case 1:
      return 40;
    case 2:
      return 100;
    case 3:
      return 300;
    case 4:
      return 1200; // Tetris !
    default:
      return 0;
  }
}

// Boucle de jeu principale
setInterval(() => {
  if (!rooms) {
    console.error("Erreur : `rooms` n'est pas défini !");
    return;
  }

  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    if (room.status !== "in-progress") return;

    room.players.forEach((playerId) => {
      const player = players[playerId];
      if (player && player.currentPiece) {
        const newPiece = movePiece(player.currentPiece, "down", player.grid);
        if (newPiece) {
          player.currentPiece = newPiece;
        } else {
          player.grid = stackPiece(player.grid, player.currentPiece);
          player.currentPiece = generateRandomPiece();

          // Supprimer les lignes complètes
          const { grid: newGrid, linesCleared } = clearCompleteLines(
            player.grid
          );
          player.grid = newGrid;

          // Mettre à jour le score
          const scoreIncrement = computeScore(linesCleared);
          player.score += scoreIncrement;
        }

        // Émettre l'état du jeu mis à jour uniquement au joueur concerné
        io.to(playerId).emit("gameState", {
          roomId: player.roomId,
          grid: player.grid,
          currentPiece: player.currentPiece,
          score: player.score,
          mode: player.mode,
        });

        // Fonction pour envoyer opponentUpdate aux autres joueurs de la room
        function sendOpponentUpdateToOthers(io, roomId, senderId, data) {
          const roomSockets = io.sockets.adapter.rooms.get(roomId);
          if (roomSockets) {
            roomSockets.forEach((socketId) => {
              if (socketId !== senderId) {
                io.to(socketId).emit("opponentUpdate", data);
              }
            });
          }
        }

        // Utiliser la fonction dans la boucle de jeu
        sendOpponentUpdateToOthers(io, player.roomId, playerId, {
          playerId: playerId,
          name: player.name,
          score: player.score,
          grid: player.grid,
        });
      }
    });
  });
}, 1000); // Chute toutes les secondes

// Lancer le serveur
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur socket.io lancé sur le port ${PORT}`);
});
