import React from "react";
import "./GameGrid.css";

function GameGrid() {
  return (
    <div className="game-grid">
      {Array.from({ length: 20 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {Array.from({ length: 10 }).map((_, colIndex) => (
            <div key={colIndex} className="grid-cell"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameGrid;
