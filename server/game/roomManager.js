// ./server/game/roomManager.js

const { v4: uuidv4 } = require("uuid");

const rooms = {};
const MAX_PLAYERS = 2; // Limite de joueurs par salle

/**
 * Crée une nouvelle room et retourne son identifiant unique.
 * @param {string} hostId - ID du joueur qui crée la room.
 * @returns {string} roomId - Identifiant unique de la room.
 */
function createRoom(hostId) {
  const roomId = uuidv4();
  rooms[roomId] = {
    host: hostId,
    players: [hostId],
    status: "waiting", // 'waiting' ou 'in-progress'
    grid: {},
    scores: {},
  };
  return roomId;
}

/**
 * Permet à un joueur de rejoindre une room existante.
 * @param {string} roomId - ID de la room à rejoindre.
 * @param {string} playerId - ID du joueur qui rejoint.
 * @returns {boolean} - Succès ou échec de l'opération.
 */
function joinRoom(roomId, playerId) {
  const room = rooms[roomId];
  if (
    room &&
    room.status === "waiting" &&
    room.players.length < MAX_PLAYERS &&
    !room.players.includes(playerId) // Vérifier que le joueur n'est pas déjà dans la salle
  ) {
    room.players.push(playerId);
    room.scores[playerId] = 0;
    room.grid[playerId] = Array.from({ length: 20 }, () => Array(10).fill(0));
    return true;
  }
  return false;
}

/**
 * Permet à un joueur de quitter une room.
 * @param {string} roomId - ID de la room.
 * @param {string} playerId - ID du joueur qui quitte.
 */
function leaveRoom(roomId, playerId) {
  const room = rooms[roomId];
  if (room) {
    room.players = room.players.filter((id) => id !== playerId);
    delete room.grid[playerId];
    delete room.scores[playerId];
    if (room.players.length === 0) {
      delete rooms[roomId];
    } else if (room.host === playerId) {
      room.host = room.players[0];
    }
  }
}

/**
 * Démarre une room en passant son statut à 'in-progress'.
 * @param {string} roomId - ID de la room à démarrer.
 * @returns {boolean} - Succès ou échec de l'opération.
 */
function startRoom(roomId, force = false) {
  const room = rooms[roomId];
  if (
    room &&
    room.status === "waiting" &&
    (force || room.players.length >= MAX_PLAYERS)
  ) {
    room.status = "in-progress";
    return true;
  }
  return false;
}

/**
 * Retourne la liste des rooms disponibles pour rejoindre.
 * @returns {Array} - Liste des rooms disponibles.
 */
function getAvailableRooms() {
  return Object.entries(rooms)
    .filter(([_, room]) => room.status === "waiting")
    .map(([roomId, room]) => ({ roomId, players: room.players.length }));
}

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  startRoom,
  getAvailableRooms,
  rooms,
};
