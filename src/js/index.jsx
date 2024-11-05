import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Selecciona el elemento raíz en el DOM
const container = document.getElementById('root');

// Crea la raíz con React 18
const root = createRoot(container);

// Renderiza el componente principal
root.render(<App />);
