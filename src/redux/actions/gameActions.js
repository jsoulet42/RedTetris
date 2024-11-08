// ./src/redux/actions/gameActions.js : Définit les actions pour mettre à jour l’état du jeu.

export const updateGameState = (gameState) => ({
  type: "UPDATE_GAME_STATE",
  payload: gameState,
});
