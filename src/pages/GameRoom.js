// ./src/pages/GameRoom.js

import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom"; // Ajouter useLocation ici
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import PlayerList from "../components/playerList/PlayerList";
import socket from "../socket";
import { updateGameState } from "../redux/actions/gameActions";
import "./GameRoom.css";
import PlayerNameInput from "../components/PlayerNameInput";

function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation(); // Obtenir l'état de navigation
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const mode = useSelector((state) => state.game.get("mode"));
  const dispatch = useDispatch();
  const gameStarted = useSelector((state) => state.game.get("gameStarted"));
  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    if (!mode) return;
    const isCreator = location.state?.isCreator;

    if (mode === "multiplayer" && roomId && !isCreator) {
      console.log("Rejoindre la room :", roomId);
      socket.emit("joinGame", { mode: "multiplayer", roomId });
    }

    return () => {
      if (mode === "multiplayer" && roomId && !isCreator) {
        console.log("Quitter la room :", roomId);
        socket.emit("leaveRoom", { roomId });
      }
    };
  }, [roomId, location.state, mode]);

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
      tabIndex="0"
      style={{ outline: "none" }}
    >
      <h1>Salle de Jeu - {roomId}</h1>
      <h2>Joueur : {playerName}</h2>
      {gameStarted || mode === "solo" ? (
        <>
          <GameGrid />
          {mode === "multiplayer" && <PlayerList />}
          <div className="score-board">
            <h2>Score: {score}</h2>
          </div>
        </>
      ) : (
        <p>En attente d'autres joueurs...</p>
      )}
    </div>
  );
}

export default GameRoom;
