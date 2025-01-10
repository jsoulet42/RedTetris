// ./src/App.js

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameRoom from "./pages/GameRoom";
import { useSelector } from "react-redux";
import PlayerNameInput from "./components/PlayerNameInput";
import SoloGame from "./pages/SoloGame";
import { useState } from "react";
import "./app.css"; // Importer les styles globaux

function App() {
  const message = useSelector((state) => state.test.get("message"));
  const score = useSelector((state) => state.game.get("score"));
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName")
  );

  const handleNameSet = (name) => {
    localStorage.setItem("playerName", name);
    setPlayerName(name);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/enter-name"
          element={<PlayerNameInput onNameSet={handleNameSet} />}
        />
        {playerName ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/solo" element={<SoloGame />} />
            <Route path="/room/:roomId" element={<GameRoom />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/enter-name" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
