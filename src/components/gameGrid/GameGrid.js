// ./src/components/gameGrid/GameGrid.js
import React from "react";
import { useSelector } from "react-redux";
import "./GameGrid.css";

function GameGrid() {
  // Récupérer la grille et la pièce actuelle depuis Redux
  const grid = useSelector((state) => state.game.get("grid"));
  const currentPiece = useSelector((state) => state.game.get("currentPiece"));

  if (!grid || !currentPiece) {
    return <div className="game-grid">Chargement...</div>;
  }

  // Superposer la pièce actuelle sur la grille
  const updatedGrid = grid.map((row, y) =>
    row.map((cell, x) => {
      if (
        currentPiece &&
        currentPiece.shape[y - currentPiece.y] &&
        currentPiece.shape[y - currentPiece.y][x - currentPiece.x] === 1
      ) {
        return 1; // Cellule occupée par la pièce actuelle
      }
      return cell;
    })
  );

  return (
    <div className="game-grid">
      {updatedGrid.map((row, rowIndex) => (
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

export default GameGrid;
