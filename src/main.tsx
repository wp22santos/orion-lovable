import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Registra o service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.error('Erro ao registrar ServiceWorker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);