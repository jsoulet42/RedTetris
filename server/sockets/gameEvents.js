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

function handleGameEvents(socket, io) {
  // Lorsqu'un joueur rejoint
  socket.on("joinGame", ({ mode, roomId }) => {
    if (mode === "solo") {
      // Créer une salle unique pour le mode solo
      const soloRoomId = createRoom(socket.id);
      startRoom(soloRoomId, true); // Forcer le démarrage en solo
      socket.join(soloRoomId);
      addPlayer(socket.id, soloRoomId, "solo"); // Passer le mode
      io.to(socket.id).emit("roomCreated", { roomId: soloRoomId });
      io.to(socket.id).emit("gameState", {
        roomId: soloRoomId,
        grid: players[socket.id].grid,
        currentPiece: players[socket.id].currentPiece,
        score: players[socket.id].score,
        mode: players[socket.id].mode,
      });
      console.log(`Room solo créée: ${soloRoomId} par ${socket.id}`);
    } else if (mode === "multiplayer") {
      if (roomId) {
        // Tenter de rejoindre une salle existante
        const success = joinRoom(roomId, socket.id);
        if (success) {
          socket.join(roomId);
          addPlayer(socket.id, roomId, "multiplayer"); // Passer le mode
          io.to(rooms[roomId].host).emit("roomJoined", {
            roomId,
            players: rooms[roomId].players.length,
          });
          console.log(`Joueur ${socket.id} a rejoint la room ${roomId}`);
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
        addPlayer(socket.id, newRoomId, "multiplayer"); // Passer le mode
        io.to(socket.id).emit("roomCreated", { roomId: newRoomId });
        console.log(
          `Nouvelle room multijoueur créée: ${newRoomId} par ${socket.id}`
        );
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
        // Vérifier et supprimer les lignes complètes
        player.grid = clearCompleteLines(player.grid);
        // Mettre à jour le score
        player.score += 100;
      }
      io.to(player.roomId).emit("gameState", {
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
      io.to(player.roomId).emit("gameState", {
        roomId: player.roomId,
        grid: player.grid,
        currentPiece: player.currentPiece,
        score: player.score,
        mode: player.mode,
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
        // Vérifier et supprimer les lignes complètes
        player.grid = clearCompleteLines(player.grid);
        // Mettre à jour le score
        player.score += 100;
      }
      io.to(player.roomId).emit("gameState", {
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
      // Informer les autres joueurs de la salle
      io.to(roomId).emit("playerLeft", { playerId: socket.id });
      console.log(`Joueur ${socket.id} a quitté la room ${roomId}`);
    }
    console.log("Joueur déconnecté :", socket.id);
  });
}

module.exports = handleGameEvents;
