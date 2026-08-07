import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="professional-layout">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment/:id" element={<Assessment />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
