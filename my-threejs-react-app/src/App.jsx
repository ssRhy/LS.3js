import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThreeScene from "./components/ThreeScene";
import MoonPage from "./pages/MoonPage";
import PetPlanetPage from "./pages/PetPlanetPage";
import FamilyStarPage from "./pages/FamilyStarPage";
import LoveStarPage from "./pages/LoveStarPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <ThreeScene />
              <main>
                <h1>lovstone</h1>
                <p>Welcome to lovestone</p>
              </main>
            </div>
          }
        />
        <Route path="/moon" element={<MoonPage />} />
        <Route path="/pet-planet" element={<PetPlanetPage />} />
        <Route path="/family-star" element={<FamilyStarPage />} />
        <Route path="/love-star" element={<LoveStarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
