import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import "./GameGrid.css"; // Assurez-vous que le chemin est correct

function GameGrid() {
  // Récupérer la grille et la pièce actuelle avec `useSelector`
  const grid = useSelector((state) => state.game.get("grid"));
  const currentPiece = useSelector((state) => state.game.get("currentPiece"));

  // On calcule la grille mise à jour dans un useMemo,
  // qu'on appelle QUOI QU'IL ARRIVE, pour ne pas changer le nombre de hooks
  const updatedGrid = useMemo(() => {
    // Si la grille ou la pièce n'existent pas encore, on retourne null
    if (!grid || !currentPiece) {
      return null;
    }

    // Sinon, on génère la grille avec la pièce
    return grid.map((row, y) =>
      row.map((cell, x) => {
        if (
          currentPiece.shape[y - currentPiece.y] &&
          currentPiece.shape[y - currentPiece.y][x - currentPiece.x] === 1
        ) {
          return 1; // Cellule occupée par la pièce actuelle
        }
        return cell;
      })
    );
  }, [grid, currentPiece]);

  // Si updatedGrid est null, on retourne "Chargement..."
  if (!updatedGrid) {
    return <div className="game-grid">Chargement...</div>;
  }

  // Sinon, on affiche la grille mise à jour
  return (
    <div className="game-grid" role="grid">
      {updatedGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row" role="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              role="gridcell"
              className={`grid-cell ${
                cell === 1 ? "filled" : cell === 2 ? "filled-malus" : ""
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameGrid;
