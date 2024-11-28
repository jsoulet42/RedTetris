// ./src/components/RoomList.js : Afficher les parties multijoueurs disponibles que les joueurs peuvent rejoindre.

import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

function RoomList({ rooms }) {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName");

  const handleJoinRoom = (roomId) => {
    socket.emit("joinGame", { mode: "multiplayer", roomId, playerName });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="room-list">
      <h2>Parties Disponibles</h2>
      {rooms.length === 0 ? (
        <p>Aucune partie disponible. Créez-en une nouvelle !</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.roomId}>
              <span>Room ID: {room.roomId}</span>
              <span>Joueurs: {room.players}/2</span>
              <button onClick={() => handleJoinRoom(room.roomId)}>
                Rejoindre
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomList;
