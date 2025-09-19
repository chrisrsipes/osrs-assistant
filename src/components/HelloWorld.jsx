import React from 'react';

function HelloWorld() {
  return (
    <div className="hello-world">
      <h2>Hello World!</h2>
      <p>Welcome to the OSRS Skilling Assistant application.</p>
      <p>This is a basic React webapp demonstrating tab functionality.</p>
      <p>Navigate to the "Farming Inventory" tab to see the seed management system in action!</p>
      
      <div className="welcome-features">
        <h3>Application Features:</h3>
        <ul>
          <li>🌱 <strong>Farming Inventory</strong> - Manage seed inventory and track yields</li>
          <li>📊 <strong>Data Management</strong> - Organized data structure with JSON files</li>
          <li>🎨 <strong>Modern UI</strong> - Beautiful responsive design with tab navigation</li>
          <li>⚡ <strong>Fast Development</strong> - Built with React 18 and Vite</li>
        </ul>
      </div>
    </div>
  );
}

export default HelloWorld;
