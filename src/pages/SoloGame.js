// ./src/pages/SoloGame/SoloGame.js

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { resetGameState } from "../redux/actions/gameActions";
import "./SoloGame.css";

function SoloGame() {
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const playerName = localStorage.getItem("playerName");
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gameStateReceived, setGameStateReceived] = useState(false);

  useEffect(() => {
    if (!gameStateReceived) {
      socket.emit("joinGame", { mode: "solo", playerName });
    }

    const handleGameState = (gameState) => {
      if (gameState.roomId && !roomId) {
        setRoomId(gameState.roomId);
        setGameStateReceived(true);
      }
    };

    socket.on("gameState", handleGameState);

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
      socket.off("gameState", handleGameState);
    };
  }, [roomId, playerName, gameStateReceived]);

  const handleQuit = () => {
    if (roomId) {
      socket.emit("leaveRoom", { roomId });
    }
    dispatch(resetGameState());
    navigate("/");
  };

  return (
    <div className="solo-game" ref={gameRoomRef} tabIndex="0">
      <h1>Partie Solo</h1>
      <h2>Joueur : {playerName}</h2>
      <GameGrid />
      <div className="score-board">
        <h2>Score: {score}</h2>
      </div>
      <button className="quit-button" onClick={handleQuit}>
        Quitter la partie
      </button>
    </div>
  );
}

export default SoloGame;
