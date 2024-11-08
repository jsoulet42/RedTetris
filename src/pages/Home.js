// ./src/pages/Home.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Home.css";
import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";

function Home() {
  const [mode, setMode] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "multiplayer") {
      // Demander la liste des rooms disponibles
      socket.emit("getAvailableRooms");
    }
  }, [mode]);

  useEffect(() => {
    // Écouter les rooms disponibles
    socket.on("availableRooms", (availableRooms) => {
      setRooms(availableRooms);
    });

    // Écouter les créations de room
    socket.on("roomCreated", ({ roomId }) => {
      navigate(`/room/${roomId}`);
    });

    // Écouter les erreurs
    socket.on("error", (message) => {
      alert(message);
    });

    return () => {
      socket.off("availableRooms");
      socket.off("roomCreated");
      socket.off("error");
    };
  }, [navigate]);

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === "solo") {
      // Émettre l'événement pour rejoindre en solo
      socket.emit("joinGame", { mode: "solo" });
    } else if (selectedMode === "multiplayer") {
      // Émettre l'événement pour rejoindre en multijoueur
      // La liste des rooms sera demandée via l'effet précédent
    }
  };

  return (
    <div className="home-page">
      <h1>Bienvenue sur Red Tetris</h1>
      {!mode && (
        <div className="mode-selection">
          <button onClick={() => handleModeSelection("solo")}>
            Jouer en Solo
          </button>
          <button onClick={() => handleModeSelection("multiplayer")}>
            Jouer en Multijoueur
          </button>
        </div>
      )}
      {mode === "multiplayer" && (
        <div className="multiplayer-options">
          <CreateRoom />
          <RoomList rooms={rooms} />
        </div>
      )}
    </div>
  );
}

export default Home;
