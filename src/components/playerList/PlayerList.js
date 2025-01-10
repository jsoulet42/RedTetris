// ./src/components/PlayerList/PlayerList.js

import React from "react";
import { useSelector } from "react-redux";
import "./PlayerList.css"; // Assurez-vous que le chemin est correct

function PlayerList() {
  const opponents = useSelector((state) => state.game.get("opponents"));

  return (
    <div className="player-list">
      <h2>Liste des joueurs</h2>
      <ul>
        {opponents &&
          opponents.valueSeq().map((opponent) => (
            <li key={opponent.get("playerId")}>
              <span>{opponent.get("name")}</span>
              <span>{opponent.get("score")}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default PlayerList;
