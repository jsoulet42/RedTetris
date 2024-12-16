// ./src/components/PlayerNameInput/PlayerNameInput.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerNameInput.css"; // Assurez-vous que le chemin est correct

function PlayerNameInput({ onNameSet }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSet(name.trim());
      navigate("/"); // Rediriger vers la page d'accueil
    }
  };

  return (
    <div className="player-name-input">
      <h2>Entrez votre nom :</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

export default PlayerNameInput;
