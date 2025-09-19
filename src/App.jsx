import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';
import FarmingInventory from './components/FarmingInventory';
import ComingSoon from './components/ComingSoon';
import './App.css';

function App() {
  const location = useLocation();

  const tabs = [
    { id: 'hello', label: 'Hello World', path: '/hello' },
    { id: 'farming', label: 'Farming Inventory', path: '/farming' },
    { id: 'coming-soon', label: 'Coming Soon', path: '/coming-soon' }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>OSRS Skilling Assistant</h1>
      </header>
      
      <nav className="tab-navigation">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`tab-button ${isActiveTab(tab.path) ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <main className="tab-content">
        <Routes>
          <Route path="/" element={<Navigate to="/hello" replace />} />
          <Route path="/hello" element={<HelloWorld />} />
          <Route path="/farming" element={<FarmingInventory />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
