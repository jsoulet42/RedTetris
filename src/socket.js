// ./src/socket.js : Configure et exporte l’instance Socket.io pour être utilisée dans les composants React.

import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_SOCKET_SERVER); // Utiliser la variable d'environnement

export default socket;
