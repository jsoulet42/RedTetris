// ./src/pages/GameRoom/GameRoom.js

import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GameGrid from "../components/gameGrid/GameGrid";
import PlayerList from "../components/playerList/PlayerList";
import socket from "../socket";
import { updateGameState, resetGameState } from "../redux/actions/gameActions";
import "./GameRoom.css";
import { useNavigate } from "react-router-dom";
import OpponentGrid from "../components/opponentGrid/OpponentGrid";

function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const gameRoomRef = useRef(null);
  const score = useSelector((state) => state.game.get("score"));
  const mode = useSelector((state) => state.game.get("mode"));
  const dispatch = useDispatch();
  const gameStarted = useSelector((state) => state.game.get("gameStarted"));
  const playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();
  const opponents = useSelector((state) => state.game.get("opponents"));

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

  const handleQuit = () => {
    socket.emit("leaveRoom", { roomId });
    navigate("/");
  };

  return (
    <div className="game-room" ref={gameRoomRef} tabIndex="0">
      <h1>Salle de Jeu - {roomId}</h1>
      <h2>Joueur : {playerName}</h2>
      {gameStarted || mode === "solo" ? (
        <div className="game-content">
          <div className="game-grid-container">
            <GameGrid />
          </div>
          {mode === "multiplayer" && (
            <div className="opponents-container">
              {opponents &&
                opponents.valueSeq().map((opponent) => (
                  <div key={opponent.get("playerId")}>
                    <h3>{opponent.get("name")}</h3>
                    <OpponentGrid grid={opponent.get("grid")} />
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <p>En attente d'autres joueurs...</p>
      )}
      {mode === "multiplayer" && <PlayerList />}
      <div className="score-board">
        <h2>Score: {score}</h2>
      </div>
      <button className="quit-button" onClick={handleQuit}>
        Quitter la partie
      </button>
    </div>
  );
}

export default GameRoom;
