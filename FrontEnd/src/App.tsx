// src/App.tsx

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Importa el componente Header
import InvestmentForm from './components/InvestmentForm';
import LoginForm from './components/LoginForm';
import './index.css'; // Importa Tailwind en el archivo principal de la aplicación
import UserProfile from './components/UserProfile';
import RegisterForm from './components/RegisterForm'; // Importa el componente RegisterForm
import { UserProvider } from './context/UserContext'; // Importa el UserProvider

function App() {
  return (
    <UserProvider> {/* Envuelve tu aplicación con el UserProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<h1 className="text-2xl">Bienvenido a Investra</h1>} /> {/* Ruta principal */}
          <Route path="/invertir" element={<InvestmentForm />} /> {/* Ruta para el formulario de inversión */}
          <Route path="/perfil" element={<UserProfile />} /> {/* Ruta para el perfil */} 
          <Route path="/login" element={<LoginForm />} /> {/* Ruta para el login */}
          <Route path="/registro" element={<RegisterForm />} /> 
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
