import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connecté au serveur socket.io");
    });

    socket.on("disconnect", () => {
      console.log("Déconnecté du serveur socket.io");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Connexion à Socket.io établie !</p>
      </header>
    </div>
  );
}

export default App;
