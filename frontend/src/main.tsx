import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import './styles.css';

const container = document.getElementById('app');

if (!container) {
  throw new Error('App root not found');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
