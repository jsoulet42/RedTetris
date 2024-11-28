// ./src/pages/SoloGame.js

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import socket from "../socket";
import "./SoloGame.css";

function SoloGame() {
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    socket.emit("joinGame", { mode: "solo", playerName });

    // Gérer les contrôles du joueur
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

    const currentRef = gameRoomRef.current;
    if (currentRef) {
      currentRef.addEventListener("keydown", handleKeyDown);
      currentRef.focus();
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <div
      className="solo-game"
      ref={gameRoomRef}
      tabIndex="0"
      style={{ outline: "none" }}
    >
      <h1>Partie Solo</h1>
      <h2>Joueur : {playerName}</h2>
      <GameGrid />
      <div className="score-board">
        <h2>Score: {score}</h2>
      </div>
    </div>
  );
}

export default SoloGame;
