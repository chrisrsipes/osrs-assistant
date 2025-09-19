import React, { useState } from 'react';
import HelloWorld from './components/HelloWorld';
import ComingSoon from './components/ComingSoon';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('hello');

  const tabs = [
    { id: 'hello', label: 'Hello World', component: <HelloWorld /> },
    { id: 'coming-soon', label: 'Coming Soon', component: <ComingSoon /> }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>OSRS Skilling Assistant</h1>
      </header>
      
      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
    </div>
  );
}

export default App;
