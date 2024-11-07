// ./src/socket.js
import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_SOCKET_SERVER); // Utiliser la variable d'environnement

export default socket;
