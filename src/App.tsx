import React from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "./App.css";
import ArtworkTable from "./components/ArtworkTable";


function App() {
  return (
    <div className="App">
      <h1>Artwork Selection</h1>
      <ArtworkTable />
    </div>
  );
}

export default App;
