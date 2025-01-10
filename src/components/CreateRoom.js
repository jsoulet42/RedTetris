// ./src/components/CreateRoom/CreateRoom.js

import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import "./CreateRoom.css"; // Assurez-vous que le chemin est correct

function CreateRoom() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName");

  const handleCreateRoom = () => {
    socket.emit("joinGame", { mode: "multiplayer", playerName, create: true });
    // L'écoute de l'événement "roomCreated" est gérée dans Home.js
  };

  return (
    <div className="create-room">
      <button onClick={handleCreateRoom}>Créer une Nouvelle Partie</button>
    </div>
  );
}

export default CreateRoom;
