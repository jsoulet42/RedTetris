// ./server/game/playerManager.js : Gère les joueurs connectés (ajout, suppression, suivi de l’état du jeu).

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
