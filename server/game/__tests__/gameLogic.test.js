// server/game/__tests__/gameLogic.test.js

// On importe les fonctions qu’on souhaite tester
const { movePiece, isValidPosition, rotatePiece } = require("../gameLogic");

// On définit des constantes de base pour la grille
// et une pièce simple (par exemple, un carré O).
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

// Par simplicité, on crée une grille vide (remplie de 0)
function createEmptyGrid() {
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
}

describe("movePiece", () => {
  test("déplace la pièce vers la gauche si aucune collision", () => {
    // Création d’une grille vide
    const grid = createEmptyGrid();

    // Pièce simple (taille 2x2) en position (5,5) par exemple
    const piece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      x: 5,
      y: 5,
    };

    // Appel de la fonction pour déplacer la pièce à gauche
    const movedPiece = movePiece(piece, "left", grid);

    // On s’attend à ce que la pièce ait x = 4, y = 5
    expect(movedPiece).toEqual({
      ...piece,
      x: 4,
      y: 5,
    });
  });

  test("ne déplace pas la pièce à gauche s’il y a collision", () => {
    // Création d’une grille où on place un bloc juste à gauche de la pièce
    const grid = createEmptyGrid();
    // On remplit la cellule (5,5) pour simuler un bloc
    // Mais attention : le bloc doit être à x=4 (si la pièce est à x=5)
    // ici, on positionne un bloc là où la pièce voudrait aller
    grid[5][4] = 1;

    // Pièce simple en position (5,5)
    const piece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      x: 5,
      y: 5,
    };

    // Appel de la fonction pour déplacer la pièce à gauche
    const movedPiece = movePiece(piece, "left", grid);

    // Comme il y a collision, la pièce ne devrait pas bouger
    expect(movedPiece).toEqual(piece);
  });

  test("renvoie null si on essaie de descendre et qu’il y a collision (empilage)", () => {
    // On met un bloc juste en dessous de la pièce
    const grid = createEmptyGrid();
    // Position (6,5) correspond à x=5, y=6 si la pièce est en (5,5)
    // Mais attention : la pièce fait 2 de hauteur, donc la ligne en dessous
    // c’est y = 7 (car y=5 + hauteur 2 = 7).
    // On place un bloc à y=7, x=5 (et x=6) pour forcer la collision
    grid[7][5] = 1;
    grid[7][6] = 1;

    // Pièce simple en position (5,5)
    const piece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      x: 5,
      y: 5,
    };

    // Appel de la fonction pour descendre
    const movedPiece = movePiece(piece, "down", grid);

    // On s’attend à ce que movePiece renvoie null, indiquant un empilage
    expect(movedPiece).toBeNull();
  });
});

describe("rotatePiece", () => {
  test("effectue la rotation d’une pièce en l’absence de collision", () => {
    const grid = createEmptyGrid();

    // Une pièce en forme de T
    const pieceT = {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      x: 4,
      y: 4,
    };

    // On applique rotatePiece
    const rotatedPiece = rotatePiece(pieceT, grid);

    // Pour rappel, la rotation 90° dans le sens horaire
    // transformera la forme T comme suit :
    //  [ [1,0],
    //    [1,1],
    //    [1,0] ]
    // On vérifie juste qu’il n’est plus identique
    expect(rotatedPiece.shape).not.toEqual(pieceT.shape);

    // On vérifie que la rotation est valide (pas de collision)
    // => On s’attend à ce que l’x et le y ne changent pas
    expect(rotatedPiece.x).toBe(4);
    expect(rotatedPiece.y).toBe(4);
  });

  test("annule la rotation en cas de collision, même avec wall kick", () => {
    const grid = createEmptyGrid();

    // Pièce T en (4,4)
    const pieceT = {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      x: 4,
      y: 4,
    };

    // Après rotation, la pièce occupe (pour x=4,y=4):
    //  (4,4), (4,5), (5,5), (4,6)
    // On place un bloc à (4,5) => collision rotation directe
    grid[5][4] = 1;

    // Offset -1 => x=3
    // la pièce occuperait (3,4),(3,5),(4,5),(3,6)
    // On bloque ça en posant un bloc à (3,5)
    grid[5][3] = 1;

    // Offset +1 => x=5
    // la pièce occuperait (5,4),(5,5),(6,5),(5,6)
    // On bloque ça en posant un bloc à (5,4)
    grid[4][5] = 1;

    const rotatedPiece = rotatePiece(pieceT, grid);

    // Maintenant, tous les scénarios de rotation sont bloqués,
    // donc la fonction doit renvoyer la pièce telle qu’elle est :
    expect(rotatedPiece).toEqual(pieceT);
  });

  test("effectue un wall kick lorsqu’une pièce I est collée (hors-bord) à gauche", () => {
    const grid = createEmptyGrid();

    // La pièce I verticale, mais placée à x=-1 (hors de la grille)
    const pieceI = {
      shape: [[1], [1], [1], [1]],
      x: -1, // démarre hors-bord à gauche
      y: 4,
    };

    const rotatedPiece = rotatePiece(pieceI, grid);

    // Puisque x=-1 est invalide, le code teste offset +1 => x=0
    // => Ça rentre dans la grille (colonnes 0..3).
    expect(rotatedPiece.x).toBe(0);
    // Vérif : on a bien changé la shape
    expect(rotatedPiece.shape).not.toEqual(pieceI.shape);
  });
});
