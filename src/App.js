// ./src/App.js
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameRoom from "./pages/GameRoom";
import { useSelector } from "react-redux";

function App() {
  // Utilisation de Redux pour afficher le message de test
  const message = useSelector((state) => state.test.get("message"));
  const score = useSelector((state) => state.game.get("score"));

  return (
    <div className="App">
      <h1>{message}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
      <div className="score-display">
        <h2>Score: {score}</h2>
      </div>
    </div>
  );
}

export default App;
