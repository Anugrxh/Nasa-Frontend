import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import PredictionPage from './components/PredictionPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
