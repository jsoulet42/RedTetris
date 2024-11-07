// ./server/game/playerManager.js
const { generateRandomPiece } = require("./gameLogic");
const { GRID_WIDTH, GRID_HEIGHT } = require("../config/constants");

const players = {};

function addPlayer(playerId) {
  players[playerId] = {
    grid: Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0)), // Initialise une grille vide
    currentPiece: generateRandomPiece(), // Assigne une pièce aléatoire
    score: 0,
  };
}

function removePlayer(playerId) {
  delete players[playerId];
}

module.exports = { addPlayer, removePlayer, players };
