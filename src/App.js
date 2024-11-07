import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import GameRoom from "./GameRoom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </div>
  );
}

export default App;
