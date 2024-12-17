import React from "react";
import "./GameOverMessage.css";

function GameOverMessage({ message, onAccept, isWinner }) {
  return (
    <div className="game-over-message">
      <h1>{message}</h1>
      <button onClick={onAccept}>
        {isWinner ? "Retour au menu" : "Accepter la défaite"}
      </button>
    </div>
  );
}

export default GameOverMessage;
