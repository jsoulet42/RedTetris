// ./src/components/CreateRoom.js

import React from "react";
import socket from "../socket";

function CreateRoom() {
  const handleCreateRoom = () => {
    socket.emit("joinGame", { mode: "multiplayer" });
  };

  return (
    <div className="create-room">
      <button onClick={handleCreateRoom}>Créer une Nouvelle Partie</button>
    </div>
  );
}

export default CreateRoom;
