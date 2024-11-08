// ./src/redux/reducers/gameReducer.js

import { Map } from "immutable";

const initialState = Map({
  grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
  currentPiece: null,
  score: 0,
  mode: "multiplayer", // Valeur par défaut, à mettre à jour avec gameState
});

function gameReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_GAME_STATE":
      return state
        .set("grid", action.payload.grid)
        .set("currentPiece", action.payload.currentPiece)
        .set("score", action.payload.score)
        .set("mode", action.payload.mode); // Mettre à jour le mode
    default:
      return state;
  }
}

export default gameReducer;
