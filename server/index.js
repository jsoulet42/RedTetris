// ./server/index.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const handleGameEvents = require("./sockets/gameEvents");
const { players } = require("./game/playerManager");
const { rooms } = require("./game/roomManager");
const { isGameOver, addMalusLines } = require("./game/gameLogic"); // Importer addMalusLines

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

function getWinnerId(roomId, loserId) {
  const room = rooms[roomId];
  if (room) {
    return room.players.find((playerId) => playerId !== loserId);
  }
  return null; // S'il n'y a pas d'autre joueur
}

// Boucle de jeu principale
setInterval(() => {
  if (!rooms) {
    console.error("Erreur : `rooms` n'est pas défini !");
    return;
  }

  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    if (room.status !== "in-progress") {
      return; // On ne traite pas cette room si elle n'est pas en cours de jeu
    }

    room.players.forEach((playerId) => {
      const player = players[playerId];
      if (player && player.currentPiece) {
        const newPiece = movePiece(player.currentPiece, "down", player.grid);
        if (newPiece) {
          player.currentPiece = newPiece;
        } else {
          player.grid = stackPiece(player.grid, player.currentPiece);
          player.currentPiece = generateRandomPiece();
          console.log(
            "DEBUG : Grille après empilement dans la boucle principale:",
            player.grid
          );
          if (isGameOver(player.grid)) {
            console.log("DEBUG : Game Over détecté juste après empilement");
            room.status = "finished";
            io.to(player.roomId).emit("gameOver", {
              loserId: playerId,
              winnerId: getWinnerId(player.roomId, playerId),
            });

            return;
          } else {
            console.log("DEBUG : Pas de game over après empilement");
          }

          // Supprimer les lignes complètes
          const { grid: newGrid, linesCleared } = clearCompleteLines(
            player.grid
          );
          player.grid = newGrid;

          // Mettre à jour le score
          const scoreIncrement = computeScore(linesCleared);
          player.score += scoreIncrement;

          // Ajouter des lignes malus aux adversaires si au moins 2 lignes sont effacées
          if (linesCleared >= 2) {
            const malusCount = linesCleared - 1;
            if (malusCount > 0) {
              // Assurez-vous que malusCount est positif
              const opponents = room.players.filter((pId) => pId !== playerId);
              opponents.forEach((opponentId) => {
                const opponent = players[opponentId];
                if (opponent) {
                  // Ajouter les lignes malus à la grille de l'adversaire
                  opponent.grid = addMalusLines(opponent.grid, malusCount);

                  // Émettre le gameState mis à jour à l'adversaire
                  io.to(opponentId).emit("gameState", {
                    roomId: opponent.roomId,
                    grid: opponent.grid,
                    currentPiece: opponent.currentPiece,
                    score: opponent.score,
                    mode: opponent.mode,
                  });
                }
              });
            }
          }
        }
        io.to(playerId).emit("gameState", {
          roomId: player.roomId,
          grid: player.grid,
          currentPiece: player.currentPiece,
          score: player.score,
          mode: player.mode,
        });

        // Envoyer une mise à jour aux adversaires seulement
        const opponents = room.players.filter((pId) => pId !== playerId);
        opponents.forEach((opponentId) => {
          io.to(opponentId).emit("opponentUpdate", {
            playerId: playerId,
            name: player.name, // Inclure le nom
            score: player.score,
            grid: player.grid,
          });
        });
      }
    });
  });
}, 1000); // Chute toutes les secondes

// Lancer le serveur
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur socket.io lancé sur le port ${PORT}`);
});
