// ./src/index.js : Point d’entrée de l’application React, configure Redux et Socket.io, et écoute les événements du serveur.

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import socket from "./socket";
import { updateGameState } from "./redux/actions/gameActions";

// Créer un composant pour gérer les connexions socket
const SocketListener = ({ children }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    // Écouter l'événement 'gameState' depuis le serveur
    socket.on("gameState", (gameState) => {
      dispatch(updateGameState(gameState));
    });

    // Nettoyage à la déconnexion
    return () => {
      socket.off("gameState");
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
