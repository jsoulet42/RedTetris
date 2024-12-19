// ./src/utils/scoreUtils.js

/**
 * Récupère l'objet des scores cumulés depuis le localStorage.
 * @returns {Object} - Objets des scores cumulés.
 */
export const getCumulativeScores = () => {
  const scores = localStorage.getItem("cumulativeScores");
  return scores ? JSON.parse(scores) : {};
};

/**
 * Met à jour le score cumulatif d'un utilisateur.
 * @param {string} playerName - Nom du joueur.
 * @param {number} currentScore - Score actuel à ajouter.
 */
export const updateCumulativeScore = (playerName, currentScore) => {
  const scores = getCumulativeScores();
  const existingScore = scores[playerName] || 0;
  scores[playerName] = existingScore + currentScore;
  localStorage.setItem("cumulativeScores", JSON.stringify(scores));
  console.log(
    `Nouveau score cumulatif pour ${playerName} : ${scores[playerName]}`
  );
};

/**
 * Récupère le score cumulatif d'un utilisateur.
 * @param {string} playerName - Nom du joueur.
 * @returns {number} - Score cumulatif.
 */
export const getPlayerCumulativeScore = (playerName) => {
  const scores = getCumulativeScores();
  return scores[playerName] || 0;
};
