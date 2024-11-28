// ./src/components/CreateRoom.js

import React from "react";
import socket from "../socket";

function CreateRoom() {
  const playerName = localStorage.getItem("playerName");

  const handleCreateRoom = () => {
    socket.emit("joinGame", { mode: "multiplayer", playerName, create: true });
  };

  return (
    <div className="create-room">
      <button onClick={handleCreateRoom}>Créer une Nouvelle Partie</button>
    </div>
  );
}

export default CreateRoom;
