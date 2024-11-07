const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Pour les tests en local ; ajuster pour des déploiements
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// Gérer les connexions socket.io
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion établie : ${socket.id}`);

  // Événements de test pour vérifier la communication
  socket.on("disconnect", () => {
    console.log(`Connexion fermée : ${socket.id}`);
  });
});

// Lancer le serveur
server.listen(PORT, () => {
  console.log(`Serveur socket.io lancé sur le port ${PORT}`);
});
