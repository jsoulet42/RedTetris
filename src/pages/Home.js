// ./src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <h1>Bienvenue sur Red Tetris</h1>
      <Link to="/room/1">
        <button>Rejoindre la Salle de Jeu</button>
      </Link>
    </div>
  );
}

export default Home;
