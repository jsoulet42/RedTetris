// ./src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import socket from "./socket";
import {
  updateGameState,
  gameStarted,
  updateOpponentState,
  setOpponents,
} from "./redux/actions/gameActions";

const SocketListener = ({ children }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Écouter l'événement 'gameState' depuis le serveur
    socket.on("gameState", (gameState) => {
      console.log("Reçu gameState :", gameState); // Debug
      dispatch(updateGameState(gameState));
    });

    // Écouter l'événement 'gameStarted'
    socket.on("gameStarted", ({ roomId }) => {
      console.log(`La partie dans la room ${roomId} a commencé.`);
      dispatch(gameStarted());
      // Vous pouvez ajouter ici des actions supplémentaires si nécessaire
    });

    // Écouter l'événement 'initialOpponents'
    socket.on("initialOpponents", (opponents) => {
      console.log("Reçu initialOpponents :", opponents);
      dispatch(setOpponents(opponents));
    });

    // Écouter l'événement 'opponentUpdate' pour mettre à jour l'affichage des adversaires
    socket.on("opponentUpdate", (data) => {
      console.log("Reçu opponentUpdate :", data);
      dispatch(updateOpponentState(data));
      // Ou mettre à jour un état local si vous préférez
    });

    // Nettoyage à la déconnexion
    return () => {
      socket.off("gameState");
      socket.off("gameStarted");
      socket.off("initialOpponents");
    };
  }, [dispatch]);

  return children;
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <SocketListener>
        <App />
      </SocketListener>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
