// ./src/pages/SoloGame/SoloGame.js

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { resetGameState } from "../redux/actions/gameActions";
import "./SoloGame.css";
import GameOverMessage from "../components/GameOverMessage";
import { updateCumulativeScore } from "../utils/scoreUtils";

function SoloGame() {
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const playerName = localStorage.getItem("playerName");
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gameStateReceived, setGameStateReceived] = useState(false);
  const [winnerId, setWinnerId] = useState(null);
  const [gameOverMessage, setGameOverMessage] = useState(null); // Ajout de l'état pour la fin de partie

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

  // Écouter l'événement de fin de partie et mettre à jour le score cumulatif
  useEffect(() => {
    socket.on("gameOver", ({ loserId, winnerId }) => {
      setWinnerId(winnerId);
      if (socket.id === loserId) {
        setGameOverMessage("Défaite : Vous avez perdu !");
        // Mettre à jour le score cumulatif
        if (playerName) {
          updateCumulativeScore(playerName, score);
        }
      } else if (socket.id === winnerId) {
        setGameOverMessage("Victoire : Vous avez gagné !");
        // Mettre à jour le score cumulatif
        if (playerName) {
          updateCumulativeScore(playerName, score);
        }
      }
    });

    return () => {
      socket.off("gameOver");
    };
  }, [playerName, score]);

  const handleQuit = () => {
    // Optionnel : Déjà géré via l'événement 'gameOver'
    // Si le joueur quitte manuellement, le serveur émettra 'gameOver'
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
      {gameOverMessage && (
        <GameOverMessage
          message={gameOverMessage}
          onAccept={handleQuit}
          isWinner={socket.id === winnerId}
        />
      )}
    </div>
  );
}

export default SoloGame;
