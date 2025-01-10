// ./server/game/gameLogic.js : Contient la logique de base du jeu (génération des pièces, mouvements, rotations, empilement, suppression des lignes).

const { GRID_WIDTH, GRID_HEIGHT } = require("../config/constants");

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

// Fonction pour ajouter des lignes malus à une grille
function addMalusLines(grid, malusCount) {
  const newLines = Array.from({ length: malusCount }, () =>
    Array(GRID_WIDTH).fill(2)
  );
  let updatedGrid = [...grid, ...newLines];

  // Si la grille dépasse la hauteur maximale, enlever les lignes du haut
  while (updatedGrid.length > GRID_HEIGHT) {
    updatedGrid.shift();
  }

  return updatedGrid;
}

// Fonction pour générer une pièce aléatoire
const generateRandomPiece = () => {
  const pieces = Object.keys(TETROMINOS);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    shape: TETROMINOS[randomPiece],
    x:
      Math.floor(GRID_WIDTH / 2) -
      Math.floor(TETROMINOS[randomPiece][0].length / 2),
    y: 0, // Positionner la pièce en haut de la grille
  };
};

// Fonction pour déplacer une pièce dans une direction spécifique
function movePiece(piece, direction, grid) {
  let newX = piece.x;
  let newY = piece.y;

  switch (direction) {
    case "left":
      newX = piece.x - 1;
      break;
    case "right":
      newX = piece.x + 1;
      break;
    case "down":
      newY = piece.y + 1;
      break;
    default:
      break;
  }

  if (isValidPosition(grid, piece, newX, newY)) {
    return { ...piece, x: newX, y: newY };
  } else {
    // Si le mouvement vers le bas n'est pas possible, empiler la pièce
    if (direction === "down") {
      return null; // Indique que la pièce doit être empilée
    }
    return piece; // Aucun changement si le mouvement n'est pas possible
  }
}

// Fonction pour faire tourner une pièce
function rotatePiece(piece, grid) {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map((row) => row[index]).reverse()
  );

  const rotatedPiece = { ...piece, shape: newShape };

  if (isValidPosition(grid, rotatedPiece, rotatedPiece.x, rotatedPiece.y)) {
    return rotatedPiece;
  }

  return piece; // Retourner la pièce originale si la rotation n'est pas valide
}

// Fonction pour faire tomber rapidement une pièce
function dropPiece(piece, grid) {
  let newY = piece.y + 1;
  while (isValidPosition(grid, piece, piece.x, newY)) {
    newY += 1;
  }
  return { ...piece, y: newY - 1 };
}

// Vérifie si la pièce peut être placée à la position spécifiée
function isValidPosition(grid, piece, newX, newY) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 1) {
        const gridX = newX + x;
        const gridY = newY + y;
        // Vérifier les limites de la grille
        if (
          gridX < 0 ||
          gridX >= GRID_WIDTH ||
          gridY >= GRID_HEIGHT ||
          (gridY >= 0 && grid[gridY][gridX] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Empile la pièce sur la grille
function stackPiece(grid, piece) {
  const newGrid = grid.map((row) => row.slice()); // Clone de la grille

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const gridX = piece.x + x;
        const gridY = piece.y + y;
        if (
          gridY >= 0 &&
          gridY < GRID_HEIGHT &&
          gridX >= 0 &&
          gridX < GRID_WIDTH &&
          newGrid[gridY][gridX] === 0
        ) {
          newGrid[gridY][gridX] = 1;
        }
      }
    });
  });

  return newGrid;
}

// Supprime les lignes complètes et renvoie la nouvelle grille
function clearCompleteLines(grid) {
  let linesCleared = 0;
  const newGrid = grid.filter((row) => {
    // On vérifie si la ligne est complète en "1"
    const isComplete = row.every((cell) => cell === 1);
    // On vérifie si la ligne contient des cellules "2" (malus)
    const containsMalus = row.includes(2);

    // On ne supprime la ligne que si elle est complète (en 1)
    // ET qu'elle ne contient pas de malus (2)
    if (isComplete && !containsMalus) {
      linesCleared += 1;
      return false; // supprimer cette ligne
    }
    return true; // conserver cette ligne
  });

  const emptyLines = Array(linesCleared)
    .fill(0)
    .map(() => Array(GRID_WIDTH).fill(0));

  return {
    grid: emptyLines.concat(newGrid),
    linesCleared,
  };
}

function isGameOver(grid) {
  console.log("DEBUG : Vérification de la grille pour Game Over :", grid);
  const gameOver = grid[0].some((cell) => cell === 1);
  console.log("DEBUG : Résultat de isGameOver :", gameOver);
  return gameOver;
}

module.exports = {
  TETROMINOS,
  generateRandomPiece,
  movePiece,
  rotatePiece,
  dropPiece,
  isValidPosition,
  stackPiece,
  clearCompleteLines,
  isGameOver,
  addMalusLines,
};
