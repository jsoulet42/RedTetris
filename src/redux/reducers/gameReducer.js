// ./src/redux/reducers/gameReducer.js

import { Map } from "immutable";

const initialState = Map({
  grid: Array.from({ length: 20 }, () => Array(10).fill(0)),
  currentPiece: null,
  score: 0,
  mode: "multiplayer",
  gameStarted: false, // Ajout de l'état initial
  opponents: Map(),
});

function gameReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_GAME_STATE":
      return state
        .set("grid", action.payload.grid)
        .set("currentPiece", action.payload.currentPiece)
        .set("score", action.payload.score)
        .set("mode", action.payload.mode)
        .set(
          "gameStarted",
          action.payload.gameStarted || state.get("gameStarted")
        ); // Mettre à jour gameStarted si présent
    case "GAME_STARTED":
      return state.set("gameStarted", true);
    case "SET_OPPONENTS":
      // Convertir la liste des adversaires en Map
      const opponentsMap = action.payload.reduce((map, opponent) => {
        return map.set(opponent.playerId, Map(opponent));
      }, Map());
      return state.set("opponents", opponentsMap);
    case "UPDATE_OPPONENT_STATE":
      return state.setIn(
        ["opponents", action.payload.playerId],
        Map(action.payload)
      );
    case "RESET_GAME_STATE":
      return initialState;
    default:
      return state;
  }
}

export default gameReducer;
