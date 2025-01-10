// ./src/App.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Fournit des matchers spécifiques pour Testing Library
import { Provider } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import App from "./App";
import store from "./redux/store";

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
