// ./src/socket.js

import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_SOCKET_SERVER);

socket.on("connect", () => {
  console.log("Socket connecté :", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket déconnecté :", reason);
});

socket.on("gameOver", ({ loserId, winnerId }) => {
  console.log(
    `DEBUG : gameOver reçu côté client. Loser: ${loserId}, Winner: ${winnerId}`
  );
});

export default socket;
