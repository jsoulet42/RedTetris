import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import GameRoom from "./GameRoom";
import { useSelector } from "react-redux";

function App() {
  // Utilisation de Redux pour afficher le message de test
  const message = useSelector((state) => state.test.get("message"));

  return (
    <div className="App">
      <h1>{message}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </div>
  );
}

export default App;
