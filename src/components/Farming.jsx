import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import FarmingInventory from './FarmingInventory';
import Activity from './Activity';
import Locations from './Locations';
import FarmRunLog from './FarmRunLog';
import './Farming.css';

function Farming() {
  const location = useLocation();
  
  const farmingPages = [
    { id: 'activity', label: 'Activity', path: '/farming/activity', icon: '📊' },
    { id: 'locations', label: 'Locations', path: '/farming/locations', icon: '📍' },
    { id: 'inventory', label: 'Inventory', path: '/farming/inventory', icon: '📦' },
    { id: 'farm-run-log', label: 'Farm Run Log', path: '/farming/farm-run-log', icon: '🏃' },
    { id: 'planning', label: 'Planning', path: '/farming/planning', icon: '📋' },
    { id: 'progress', label: 'Progress', path: '/farming/progress', icon: '📈' },
    { id: 'guides', label: 'Guides', path: '/farming/guides', icon: '📚' }
  ];

  const isActivePage = (path) => {
    // Handle root farming path - show activity as active
    if (location.pathname === '/farming' && path === '/farming/activity') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="farming-container">
      <div className="farming-header">
        <h2>Farming</h2>
        <p>Manage your farming activities and track your progress</p>
      </div>

      {/* Farming Sub-navigation - Now at top */}
      <nav className="farming-nav">
        {farmingPages.map(page => (
          <Link
            key={page.id}
            to={page.path}
            className={`farming-nav-button ${isActivePage(page.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-label">{page.label}</span>
          </Link>
        ))}
      </nav>

      {/* Farming Content */}
      <div className="farming-content">
        <Routes>
          <Route path="/" element={<Activity />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/inventory" element={<FarmingInventory />} />
          <Route path="/farm-run-log" element={<FarmRunLog />} />
          <Route path="/planning" element={<div className="coming-soon-page">
            <h3>Farming Planning</h3>
            <p>Plan your farming activities and optimize your routes</p>
            <div className="coming-soon-icon">🚧</div>
          </div>} />
          <Route path="/progress" element={<div className="coming-soon-page">
            <h3>Farming Progress</h3>
            <p>Track your farming progress and achievements</p>
            <div className="coming-soon-icon">📈</div>
          </div>} />
          <Route path="/guides" element={<div className="coming-soon-page">
            <h3>Farming Guides</h3>
            <p>Learn about farming techniques and strategies</p>
            <div className="coming-soon-icon">📖</div>
          </div>} />
        </Routes>
      </div>
    </div>
  );
}

export default Farming;
