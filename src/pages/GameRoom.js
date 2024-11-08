// ./src/pages/GameRoom.js

import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import PlayerList from "../components/playerList/PlayerList";
import socket from "../socket";
import { updateGameState } from "../redux/actions/gameActions";
import "./GameRoom.css";

function GameRoom() {
  const { roomId } = useParams();
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const mode = useSelector((state) => state.game.get("mode"));
  const dispatch = useDispatch();

  useEffect(() => {
    // Si roomId est présent, rejoindre la room
    if (roomId) {
      console.log("Rejoindre la room :", roomId); // Debug
      // L'événement 'joinGame' est déjà émis depuis Home.js
      // Donc, pas besoin de l'émettre ici
    }

    // Gérer les déconnexions
    return () => {
      if (roomId) {
        socket.emit("leaveRoom", { roomId });
      }
      socket.disconnect();
    };
  }, [roomId]);

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
      <h1>Salle de Jeu - {roomId}</h1>
      <GameGrid />
      {mode === "multiplayer" && <PlayerList />}{" "}
      {/* Afficher uniquement en multijoueur */}
      <div className="score-board">
        <h2>Score: {score}</h2>
      </div>
    </div>
  );
}

export default GameRoom;
