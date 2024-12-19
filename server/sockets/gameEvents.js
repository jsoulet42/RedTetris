// ./server/sockets/gameEvents.js

const { isGameOver } = require("../game/gameLogic");

const {
  movePiece,
  rotatePiece,
  generateRandomPiece,
  dropPiece,
  stackPiece,
  clearCompleteLines,
  addMalusLines,
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
  // Gestion de l'événement 'getAvailableRooms'
  socket.on("getAvailableRooms", () => {
    const availableRooms = getAvailableRooms();
    socket.emit("availableRooms", availableRooms);
  });

  // Gestion de l'événement 'joinGame'
  socket.on("joinGame", ({ mode, roomId, playerName }) => {
    const existingPlayer = players[socket.id];
    if (existingPlayer && existingPlayer.mode === mode) {
      // Le joueur est déjà dans une room du même mode, éviter la duplication
      console.log(
        `Le joueur ${socket.id} est déjà dans une room de mode ${mode}`
      );
      return;
    }

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

          // Notifier tous les clients connectés des rooms disponibles
          const availableRooms = getAvailableRooms();
          io.emit("availableRooms", availableRooms);

          // Informer les autres joueurs de la room de l'arrivée du nouveau joueur
          socket.broadcast.to(roomId).emit("opponentUpdate", {
            playerId: socket.id,
            name: players[socket.id].name,
            score: players[socket.id].score,
            grid: players[socket.id].grid,
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
                  grid: players[id].grid, // Inclure la grille de l'adversaire
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

  // Gestion de l'événement 'leaveRoom' pour tous les modes
  socket.on("leaveRoom", ({ roomId }) => {
    const room = rooms[roomId];
    leaveRoom(roomId, socket.id);
    socket.leave(roomId);
    removePlayer(socket.id);
    console.log(`Joueur ${socket.id} a quitté la room ${roomId}`);

    if (room && room.status === "finished") {
      room.players.forEach((playerId) => {
        socket.leave(roomId);
        removePlayer(playerId);
        console.log(`Joueur ${playerId} a quitté la room ${roomId}`);
      });
      io.to(roomId).emit("roomClosed");
      delete rooms[roomId];
    } else if (room && room.status === "in-progress") {
      // La partie est en cours et un joueur quitte : émettre 'gameOver' pour les autres joueurs
      room.players.forEach((playerId) => {
        io.to(playerId).emit("gameOver", {
          loserId: socket.id,
          winnerId: playerId, // Le joueur restant est le gagnant
        });
      });
      room.status = "finished"; // Marquer la room comme terminée
    } else {
      const availableRooms = getAvailableRooms();
      io.emit("availableRooms", availableRooms);
      if (room) {
        io.to(roomId).emit("playerLeft", { playerId: socket.id });
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
        console.log("DEBUG : Grille après empilement :", player.grid);
        player.currentPiece = generateRandomPiece();

        // Supprimer les lignes complètes
        const { grid: newGrid, linesCleared } = clearCompleteLines(player.grid);
        player.grid = newGrid;

        // Mettre à jour le score en fonction des lignes supprimées
        const scoreIncrement = computeScore(linesCleared);
        player.score += scoreIncrement;
        // Ajouter des lignes malus aux adversaires si au moins 2 lignes sont effacées
        if (linesCleared >= 2) {
          const malusCount = linesCleared - 1;
          const room = rooms[player.roomId];
          if (room) {
            const opponents = room.players.filter((pId) => pId !== socket.id);
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
      io.to(socket.id).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
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
        grid: players[socket.id].grid,
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
        console.log("DEBUG : Grille après empilement :", player.grid);
        player.currentPiece = generateRandomPiece();
        // Supprimer les lignes complètes
        const { grid: newGrid, linesCleared } = clearCompleteLines(player.grid);
        player.grid = newGrid;

        // Mettre à jour le score en fonction des lignes supprimées
        const scoreIncrement = computeScore(linesCleared);
        player.score += scoreIncrement;

        // Ajouter des lignes malus aux adversaires si au moins 2 lignes sont effacées
        if (linesCleared >= 2) {
          const malusCount = linesCleared - 1;
          const room = rooms[player.roomId];
          if (room) {
            const opponents = room.players.filter((pId) => pId !== socket.id);
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
      io.to(socket.id).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
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
      console.log(`Joueur ${socket.id} a quitté la room ${roomId}`);

      const room = rooms[roomId];
      if (room && room.status === "in-progress") {
        // Émettre 'gameOver' aux autres joueurs
        room.players.forEach((playerId) => {
          io.to(playerId).emit("gameOver", {
            loserId: socket.id,
            winnerId: playerId, // Le joueur restant est le gagnant
          });
        });
        room.status = "finished"; // Marquer la room comme terminée
      }

      const availableRooms = getAvailableRooms();
      io.emit("availableRooms", availableRooms);
      if (room) {
        io.to(roomId).emit("playerLeft", { playerId: socket.id });
      }
    }
    console.log("Joueur déconnecté :", socket.id);
  });

  // ... autres événements ...
}

function getWinnerId(roomId, loserId) {
  const room = rooms[roomId];
  if (room) {
    return room.players.find((playerId) => playerId !== loserId); // Retourne l'autre joueur
  }
  return null; // S'il n'y a pas d'autre joueur
}

module.exports = handleGameEvents;
