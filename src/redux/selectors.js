import { createSelector } from "reselect";

// Sélecteur de base : accède à la branche "game" de votre state
const selectGame = (state) => state.game;

// Sélecteur pour la grille
export const selectGrid = createSelector(
  [selectGame],
  (game) => game.get("grid") // Utilisation d'Immutable.js
);

// Sélecteur pour la pièce actuelle
export const selectCurrentPiece = createSelector([selectGame], (game) =>
  game.get("currentPiece")
);
