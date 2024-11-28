// ./src/components/PlayerNameInput.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayerNameInput({ onNameSet }) {
  // Accepter onNameSet en tant que prop
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Appeler onNameSet pour mettre à jour le nom du joueur
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
        />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

export default PlayerNameInput;
