import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Import this
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      {/* You MUST wrap App with BrowserRouter if you use routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
