// ./src/pages/GameRoom.js

import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom"; // Ajouter useLocation ici
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import PlayerList from "../components/playerList/PlayerList";
import socket from "../socket";
import { updateGameState } from "../redux/actions/gameActions";
import "./GameRoom.css";

function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation(); // Obtenir l'état de navigation
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const mode = useSelector((state) => state.game.get("mode"));
  const dispatch = useDispatch();
  const gameStarted = useSelector((state) => state.game.get("gameStarted"));

  useEffect(() => {
    const isCreator = location.state?.isCreator;

    console.log("Mount GameRoom, isCreator:", isCreator);

    if (roomId && !isCreator) {
      console.log("Rejoindre la room :", roomId);
      socket.emit("joinGame", { mode: "multiplayer", roomId });
    }

    return () => {
      if (roomId && !isCreator) {
        console.log("Quitter la room :", roomId);
        socket.emit("leaveRoom", { roomId });
      }
    };
  }, [roomId, location.state]);

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
      {gameStarted ? (
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
