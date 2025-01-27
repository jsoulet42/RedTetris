// ./src/App.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import App from "./App";
import store from "./redux/store";
import GameGrid from "./components/gameGrid/GameGrid";
import configureMockStore from "redux-mock-store";

// Création d'un historique mémoire pour simuler la navigation
const history = createMemoryHistory();

// Test pour vérifier que la page d'accueil s'affiche correctement pour un utilisateur authentifié
test("renders home page for authenticated user", () => {
  // Simule l'état d'un utilisateur authentifié en enregistrant un nom dans le localStorage
  localStorage.setItem("playerName", "TestPlayer");

  // Rendu du composant App dans un contexte Redux et Router
  render(
    <Provider store={store}>
      <HistoryRouter
        history={history}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </HistoryRouter>
    </Provider>
  );

  // Vérifie si un élément spécifique de la page d'accueil est présent dans le DOM
  const homeElement = screen.getByText(/Bienvenue sur Red Tetris/i);
  expect(homeElement).toBeInTheDocument();
});

// Test pour vérifier que les utilisateurs non authentifiés sont redirigés vers la page de saisie de nom
test("redirects unauthenticated user to enter-name", () => {
  // Simule l'état d'un utilisateur non authentifié en supprimant le nom dans le localStorage
  localStorage.removeItem("playerName");

  // Rendu du composant App dans un contexte Redux et Router
  render(
    <Provider store={store}>
      <HistoryRouter
        history={history}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </HistoryRouter>
    </Provider>
  );

  // Vérifie si un élément spécifique de la page de saisie de nom est présent dans le DOM
  const enterNameElement = screen.getByText(/Entrez votre nom/i);
  expect(enterNameElement).toBeInTheDocument();
});

// On déclare ces constantes en dehors du store pour avoir une référence unique
const mockGrid = Array.from({ length: 20 }, () => Array(10).fill(0));
const mockPiece = {
  shape: [
    [1, 1],
    [1, 1],
  ],
  x: 4,
  y: 2,
};

const mockStore = configureMockStore([]);

// Test pour vérifier que la grille de jeu s'affiche avec les cellules appropriées
test("renders game grid with current piece overlay", () => {
  // On réutilise les références uniques au lieu de recréer un tableau/pièce à chaque appel
  const store = mockStore({
    game: {
      get: (key) => {
        if (key === "grid") {
          return mockGrid; // Utilise la même référence
        }
        if (key === "currentPiece") {
          return mockPiece; // Utilise la même référence
        }
        return null;
      },
    },
  });

  render(
    <Provider store={store}>
      <GameGrid />
    </Provider>
  );

  // Vérifiez que la grille contient le bon nombre de cellules (20x10)
  const cells = screen.getAllByRole("gridcell");
  expect(cells.length).toBe(200);

  // Vérifiez qu'il y a 4 cellules remplies correspondant à la pièce active
  const filledCells = cells.filter((cell) => cell.classList.contains("filled"));
  expect(filledCells.length).toBe(4);
});

// Test pour vérifier que la grille de jeu affiche un message de chargement en cas de données manquantes
test("renders loading message when game grid data is missing", () => {
  // Mock Redux state avec une grille et pièce absentes
  const mockStore = {
    getState: () => ({
      game: {
        get: () => null,
      },
    }),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  // Rendu du composant GameGrid
  render(
    <Provider store={mockStore}>
      <GameGrid />
    </Provider>
  );

  // Vérifie que le message de chargement s'affiche
  expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
});
