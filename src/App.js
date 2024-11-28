// ./src/App.js

import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameRoom from "./pages/GameRoom";
import { useSelector } from "react-redux";
import PlayerNameInput from "./components/PlayerNameInput"; // Importer le nouveau composant
import SoloGame from "./pages/SoloGame"; // Ajouter cette ligne dans App.js
import { useState } from "react";

function App() {
  // Utilisation de Redux pour afficher le message de test
  const message = useSelector((state) => state.test.get("message"));
  const score = useSelector((state) => state.game.get("score"));

  // Vérifier si le nom du joueur est défini
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
        {/* Route pour entrer le nom du joueur */}
        <Route
          path="/enter-name"
          element={<PlayerNameInput onNameSet={handleNameSet} />}
        />

        {/* Si le nom du joueur est défini, afficher les autres routes */}
        {playerName ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/solo" element={<SoloGame />} />
            <Route path="/room/:roomId" element={<GameRoom />} />
            {/* Rediriger toute autre route vers la page d'accueil */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* Si le nom du joueur n'est pas défini, rediriger vers /enter-name */
          <Route path="*" element={<Navigate to="/enter-name" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
