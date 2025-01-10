// ./src/pages/Home/Home.js

import React from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Home.css";
import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";
import { getPlayerCumulativeScore } from "../utils/scoreUtils";

function Home() {
  const [mode, setMode] = React.useState(null);
  const [rooms, setRooms] = React.useState([]);
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName");

  React.useEffect(() => {
    if (mode === "multiplayer") {
      socket.emit("getAvailableRooms");
    }
  }, [mode]);

  React.useEffect(() => {
    socket.on("availableRooms", (availableRooms) => {
      setRooms(availableRooms);
    });

    socket.on("roomCreated", ({ roomId }) => {
      navigate(`/room/${roomId}`, { state: { isCreator: true } });
    });

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
      navigate("/solo");
    }
  };

  const cumulativeScore = playerName ? getPlayerCumulativeScore(playerName) : 0;

  return (
    <div className="home-page">
      <h1>Bienvenue sur Red Tetris</h1>
      <h2>Bonjour {playerName} !</h2>
      {/* Afficher le score cumulatif */}
      <div className="cumulative-score">
        <h2>Score Total: {cumulativeScore}</h2>
      </div>
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
