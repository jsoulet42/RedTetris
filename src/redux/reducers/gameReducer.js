// ./src/redux/reducers/gameReducer.js : Gère l’état du jeu (grille, pièce actuelle, score).
import { Map } from "immutable";

const initialState = Map({
  grid: Array(20).fill(Array(10).fill(0)), // Grille 20x10 vide
  currentPiece: null, // Pas de pièce initialement
  score: 0,
});

function gameReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_GAME_STATE":
      return state
        .set("grid", action.payload.grid)
        .set("currentPiece", action.payload.currentPiece)
        .set("score", action.payload.score);
    default:
      return state;
  }
}

export default gameReducer;
