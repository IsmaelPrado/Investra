// src/App.tsx
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import InvestmentForm from './components/InvestmentForm';
import LoginForm from './components/LoginForm';
import './index.css'; 
import UserProfile from './components/UserProfile';
import RegisterForm from './components/RegisterForm'; 
import { UserProvider } from './context/UserContext'; 
import React from 'react';
import PrivateRoute from './components/PrivateRoute'; // Importa el componente PrivateRoute
import PublicRoute from './components/PublicRoute'; // Importa el componente PublicRoute
import 'toastr/build/toastr.min.css'; // Importar estilos de Toastr



function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<h1 className="text-2xl">Bienvenido a Investra</h1>} />
          
          {/* Usa el componente PrivateRoute para proteger las rutas */}
          <Route element={<PrivateRoute />}>
            <Route path="/invertir" element={<InvestmentForm />} />
            <Route path="/perfil" element={<UserProfile />} />
          </Route>

          {/* Usa el componente PublicRoute para proteger las rutas de login y registro */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />
          </Route>

          {/* Redirigir a login si no hay usuario y se intenta acceder a rutas protegidas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
