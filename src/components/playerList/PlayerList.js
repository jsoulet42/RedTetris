// ./src/components/playerList/PlayerList.js : Affiche la liste des joueurs connectés (actuellement statique).

import React from "react";
import "./PlayerList.css";

function PlayerList() {
  const players = ["Player 1", "Player 2", "Player 3"]; // Exemple de données

  return (
    <div className="player-list">
      <h2>Liste des joueurs</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
