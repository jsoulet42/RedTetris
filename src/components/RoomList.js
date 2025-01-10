// ./src/components/RoomList/RoomList.js

import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import "./RoomList.css"; // Assurez-vous que le chemin est correct

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
