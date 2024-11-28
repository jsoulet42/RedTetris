// ./server/sockets/gameEvents.js

const {
  movePiece,
  rotatePiece,
  generateRandomPiece,
  dropPiece,
  stackPiece,
  clearCompleteLines,
} = require("../game/gameLogic");
const { addPlayer, removePlayer, players } = require("../game/playerManager");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  startRoom,
  getAvailableRooms,
  rooms,
} = require("../game/roomManager");

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

function handleGameEvents(socket, io) {
  socket.on("getAvailableRooms", () => {
    const availableRooms = getAvailableRooms();
    socket.emit("availableRooms", availableRooms);
  });

  // Lorsqu'un joueur rejoint
  socket.on("joinGame", ({ mode, roomId, playerName }) => {
    if (mode === "solo") {
      // Créer une salle unique pour le mode solo
      const soloRoomId = createRoom(socket.id);
      startRoom(soloRoomId, true); // Forcer le démarrage en solo
      socket.join(soloRoomId);
      addPlayer(socket.id, soloRoomId, "solo", playerName); // Passer le mode
      io.to(socket.id).emit("roomCreated", { roomId: soloRoomId });
      io.to(socket.id).emit("gameState", {
        roomId: soloRoomId,
        grid: players[socket.id].grid,
        currentPiece: players[socket.id].currentPiece,
        score: players[socket.id].score,
        mode: players[socket.id].mode,
      });
      // Après avoir émis 'gameState' pour le mode solo
      io.to(socket.id).emit("gameStarted", { roomId: soloRoomId });

      console.log(`Room solo créée: ${soloRoomId} par ${socket.id}`);
    } else if (mode === "multiplayer") {
      if (roomId) {
        // Tenter de rejoindre une salle existante
        const success = joinRoom(roomId, socket.id);
        if (success) {
          socket.join(roomId);
          addPlayer(socket.id, roomId, "multiplayer", playerName); // Passer le mode
          io.to(rooms[roomId].host).emit("roomJoined", {
            roomId,
            players: rooms[roomId].players.length,
          });
          console.log(`Joueur ${socket.id} a rejoint la room ${roomId}`);
          // Informer les autres joueurs de la room de l'arrivée du nouveau joueur
          socket.broadcast.to(roomId).emit("opponentUpdate", {
            playerId: socket.id,
            name: players[socket.id].name,
            score: players[socket.id].score,
            // Vous pouvez ajouter d'autres informations comme le nom si vous l'avez
          });
          // Si la salle atteint le nombre de joueurs requis (2), démarrer la partie
          if (rooms[roomId].players.length >= 2) {
            startRoom(roomId);
            io.to(roomId).emit("gameStarted", { roomId });
            console.log(`Partie démarrée dans la room ${roomId}`);
            // Émettre l'état initial du jeu à tous les joueurs de la salle
            rooms[roomId].players.forEach((playerId) => {
              io.to(playerId).emit("gameState", {
                roomId,
                grid: players[playerId].grid,
                currentPiece: players[playerId].currentPiece,
                score: players[playerId].score,
                mode: players[playerId].mode,
              });
              // Envoyer les informations sur les adversaires
              const opponents = rooms[roomId].players
                .filter((id) => id !== playerId)
                .map((id) => ({
                  playerId: id,
                  name: players[id].name,
                  score: players[id].score,
                  // Vous pouvez ajouter d'autres informations comme le nom si vous l'avez
                }));

              io.to(playerId).emit("initialOpponents", opponents);
            });
          }
        } else {
          // Salle pleine ou inexistante
          io.to(socket.id).emit(
            "error",
            "La partie est pleine ou n'existe pas."
          );
          console.log(`Échec de rejoindre la room ${roomId} pour ${socket.id}`);
        }
      } else {
        // Créer une nouvelle salle multijoueur
        const newRoomId = createRoom(socket.id);
        socket.join(newRoomId);
        addPlayer(socket.id, newRoomId, "multiplayer", playerName); // Passer le mode
        io.to(socket.id).emit("roomCreated", { roomId: newRoomId });
        console.log(
          `Nouvelle room multijoueur créée: ${newRoomId} par ${socket.id}`
        );
        // Émettre la liste mise à jour des rooms disponibles à tous les clients
        const availableRooms = getAvailableRooms();
        io.emit("availableRooms", availableRooms);
      }
    }
  });

  // Gérer les déplacements des pièces
  socket.on("movePiece", (direction) => {
    const player = players[socket.id];
    if (player && player.currentPiece) {
      const newPiece = movePiece(player.currentPiece, direction, player.grid);
      if (newPiece) {
        player.currentPiece = newPiece;
      } else {
        // Empiler la pièce sur la grille
        player.grid = stackPiece(player.grid, player.currentPiece);
        player.currentPiece = generateRandomPiece();
        // Supprimer les lignes complètes
        const { grid: newGrid, linesCleared } = clearCompleteLines(player.grid);
        player.grid = newGrid;

        // Mettre à jour le score en fonction des lignes supprimées
        const scoreIncrement = computeScore(linesCleared);
        player.score += scoreIncrement;
      }
      io.to(socket.id).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
      });

      // Envoyer une mise à jour aux autres joueurs de la room
      socket.broadcast.to(player.roomId).emit("opponentUpdate", {
        playerId: socket.id,
        name: players[socket.id].name, // Inclure le nom
        score: player.score,
        // Tu peux inclure une version simplifiée de la grille si nécessaire
      });
    }
  });

  // Gérer la rotation des pièces
  socket.on("rotatePiece", () => {
    const player = players[socket.id];
    if (player && player.currentPiece) {
      const rotatedPiece = rotatePiece(player.currentPiece, player.grid);
      player.currentPiece = rotatedPiece;
      io.to(socket.id).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
      });

      // Envoyer une mise à jour aux autres joueurs de la room
      socket.broadcast.to(player.roomId).emit("opponentUpdate", {
        playerId: socket.id,
        name: players[socket.id].name, // Inclure le nom
        score: player.score,
        // Tu peux inclure une version simplifiée de la grille si nécessaire
      });
    }
  });

  // Gérer la chute rapide des pièces
  socket.on("dropPiece", () => {
    const player = players[socket.id];
    if (player && player.currentPiece) {
      const droppedPiece = dropPiece(player.currentPiece, player.grid);
      if (droppedPiece) {
        player.currentPiece = droppedPiece;
      } else {
        // Empiler la pièce sur la grille
        player.grid = stackPiece(player.grid, player.currentPiece);
        player.currentPiece = generateRandomPiece();
        // Supprimer les lignes complètes
        const { grid: newGrid, linesCleared } = clearCompleteLines(player.grid);
        player.grid = newGrid;

        // Mettre à jour le score en fonction des lignes supprimées
        const scoreIncrement = computeScore(linesCleared);
        player.score += scoreIncrement;
      }
      io.to(socket.id).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
      });

      // Envoyer une mise à jour aux autres joueurs de la room
      socket.broadcast.to(player.roomId).emit("opponentUpdate", {
        playerId: socket.id,
        name: players[socket.id].name, // Inclure le nom
        score: player.score,
      });
    }
  });

  // Lorsqu'un joueur se déconnecte
  socket.on("disconnect", () => {
    const player = players[socket.id];
    if (player) {
      const roomId = player.roomId;
      leaveRoom(roomId, socket.id);
      removePlayer(socket.id);
      // Après avoir supprimé le joueur et quitté la room
      const availableRooms = getAvailableRooms();
      io.emit("availableRooms", availableRooms);
      // Informer les autres joueurs de la salle
      io.to(roomId).emit("playerLeft", { playerId: socket.id });
      console.log(`Joueur ${socket.id} a quitté la room ${roomId}`);
    }
    console.log("Joueur déconnecté :", socket.id);
  });
}

module.exports = handleGameEvents;
