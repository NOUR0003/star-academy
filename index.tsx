import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
// DELETE THIS LINE: import { BrowserRouter } from 'react-router-dom'; 
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
       {/* DELETE <BrowserRouter> wrapper here */}
       <App />
       {/* DELETE </BrowserRouter> wrapper here */}
    </React.StrictMode>
  );
}
