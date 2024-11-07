function App() {
  // Ajoute ici pour voir toutes les variables d'environnement accessibles
  console.log("Variables d'environnement :", process.env);

  // Ajoute spécifiquement la variable REACT_APP_API_URL pour la tester
  console.log("API URL:", process.env.REACT_APP_API_URL);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
