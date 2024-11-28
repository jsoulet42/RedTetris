// ./src/components/playerList/PlayerList.js

import React from "react";
import { useSelector } from "react-redux";
import "./PlayerList.css";

function PlayerList() {
  const opponents = useSelector((state) => state.game.get("opponents"));

  return (
    <div className="player-list">
      <h2>Liste des joueurs</h2>
      <ul>
        {opponents &&
          opponents.valueSeq().map((opponent) => (
            <li key={opponent.get("playerId")}>
              {opponent.get("name")} - Score: {opponent.get("score")}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default PlayerList;
