import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './Components/Contextos/AuthContext.jsx';
import PokemonProvider from './Components/Contextos/PokemonContext.jsx';
import EquipaProvider from './Components/Contextos/EquipaContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PokemonProvider>
          <EquipaProvider>
            <App />
          </EquipaProvider>
        </PokemonProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
