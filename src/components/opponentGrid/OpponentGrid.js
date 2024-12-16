// ./src/components/OpponentGrid/OpponentGrid.js

import React from "react";
import "./OpponentGrid.css"; // Assurez-vous que le chemin est correct

function OpponentGrid({ grid }) {
  console.log("Opponent grid received:", grid);
  if (!grid || !Array.isArray(grid)) {
    return <div className="game-grid">Chargement...</div>;
  }

  return (
    <div className="game-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${cell ? "filled" : ""}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OpponentGrid;
