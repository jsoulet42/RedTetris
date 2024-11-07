import React from "react";
import GameGrid from "./GameGrid";
import PlayerList from "./PlayerList";

function GameRoom() {
  return (
    <div className="game-room">
      <h1>Page de la salle de jeu - Game Room</h1>
      <GameGrid />
      <PlayerList />
    </div>
  );
}

export default GameRoom;
