// ./src/redux/actions/gameActions.js

export const updateGameState = (gameState) => ({
  type: "UPDATE_GAME_STATE",
  payload: gameState,
});

export const gameStarted = () => ({
  type: "GAME_STARTED",
});

export const updateOpponentState = (data) => ({
  type: "UPDATE_OPPONENT_STATE",
  payload: data,
});

export const setOpponents = (opponents) => ({
  type: "SET_OPPONENTS",
  payload: opponents,
});

export const resetGameState = () => ({
  type: "RESET_GAME_STATE",
});
