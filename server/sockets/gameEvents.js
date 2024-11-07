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

function handleGameEvents(socket, io) {
  // Lorsqu'un joueur rejoint
  socket.on("joinGame", () => {
    addPlayer(socket.id);
    console.log("Émission initiale de gameState pour :", socket.id);
    io.to(socket.id).emit("gameState", players[socket.id]);
  });

  // Gérer le déplacement des pièces
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
      io.to(socket.id).emit("gameState", player);
    }
  });

  // Gérer la rotation des pièces
  socket.on("rotatePiece", () => {
    const player = players[socket.id];
    if (player && player.currentPiece) {
      const rotatedPiece = rotatePiece(player.currentPiece, player.grid);
      player.currentPiece = rotatedPiece;
      io.to(socket.id).emit("gameState", player);
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
      io.to(socket.id).emit("gameState", player);
    }
  });

  // Lorsqu'un joueur se déconnecte
  socket.on("disconnect", () => {
    removePlayer(socket.id);
    console.log("Joueur déconnecté :", socket.id);
    // Optionnel : Informer les autres joueurs
  });
}

module.exports = handleGameEvents;
