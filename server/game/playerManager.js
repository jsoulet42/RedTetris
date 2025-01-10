// ./server/game/playerManager.js

const { generateRandomPiece } = require("./gameLogic");
const { GRID_WIDTH, GRID_HEIGHT } = require("../config/constants");

const players = {};

/**
 * Ajoute un joueur et l'associe à une room.
 * @param {string} playerId - ID unique du joueur (socket.id)
 * @param {string} roomId - ID de la room
 * @param {string} mode - Mode de jeu ('solo' ou 'multiplayer')
 */
function addPlayer(
  playerId,
  roomId,
  mode = "multiplayer",
  playerName = "Anonyme"
) {
  players[playerId] = {
    roomId,
    mode, // Mode de jeu
    name: playerName, // Ajouter le nom du joueur
    grid: Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0)), // Initialise une grille vide
    currentPiece: generateRandomPiece(), // Assigne une pièce aléatoire
    score: 0,
  };
}

function removePlayer(playerId) {
  delete players[playerId];
}

module.exports = { addPlayer, removePlayer, players };
