// ./src/pages/Home/Home.js

import React from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Home.css";
import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";

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
