// ./src/redux/reducers/index.js : Combine tous les reducers en un rootReducer.

import { combineReducers } from "redux";
import testReducer from "./testReducer";
import gameReducer from "./gameReducer"; // Import du nouveau reducer

const rootReducer = combineReducers({
  test: testReducer,
  game: gameReducer, // Ajout du reducer du jeu
});

export default rootReducer;
