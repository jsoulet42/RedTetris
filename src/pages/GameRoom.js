// ./src/pages/GameRoom.js
import React, { useEffect, useRef } from "react";
import GameGrid from "../components/gameGrid/GameGrid";
import PlayerList from "../components/playerList/PlayerList";
import socket from "../socket";

function GameRoom() {
  const gameRoomRef = useRef(null);

  useEffect(() => {
    // Émettre l'événement 'joinGame' au serveur lorsque le composant est monté
    socket.emit("joinGame");

    // Gérer les déconnexions
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          socket.emit("movePiece", "left");
          break;
        case "ArrowRight":
          socket.emit("movePiece", "right");
          break;
        case "ArrowDown":
          socket.emit("movePiece", "down");
          break;
        case "ArrowUp":
          socket.emit("rotatePiece");
          break;
        case " ":
          socket.emit("dropPiece");
          break;
        default:
          break;
      }
    };

    // Attacher l'écouteur d'événements clavier au conteneur de GameRoom
    const currentRef = gameRoomRef.current;
    if (currentRef) {
      currentRef.addEventListener("keydown", handleKeyDown);
      currentRef.focus();
    }

    // Nettoyage
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <div
      className="game-room"
      ref={gameRoomRef}
      tabIndex="0" // Permet de recevoir les événements clavier
      style={{ outline: "none" }} // Supprimer le contour de focus par défaut
    >
      <h1>Page de la salle de jeu - Game Room</h1>
      <GameGrid />
      <PlayerList />
      <div className="score-board">
        <h2>Score: {/* Afficher le score depuis Redux */}</h2>
      </div>
    </div>
  );
}

export default GameRoom;
