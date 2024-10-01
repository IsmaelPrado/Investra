// src/App.tsx
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import InvestmentForm from './components/InvestmentForm';
import LoginForm from './components/LoginForm';
import './index.css'; 
import RegisterForm from './components/RegisterForm'; 
import { UserProvider } from './context/UserContext'; 
import React, { useEffect, useState } from 'react';
import PrivateRoute from './components/PrivateRoute'; // Importa el componente PrivateRoute
import PublicRoute from './components/PublicRoute'; // Importa el componente PublicRoute
import 'toastr/build/toastr.min.css'; // Importar estilos de Toastr
import FinancialNews from './components/Academy/Academy';

function App() {
  // Estado para almacenar el nombre y saldo del usuario
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  // Efecto para recuperar la información del local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.nombre); // Asigna el nombre
      setUserBalance(Number(user.saldo)); // Convierte el saldo a número y asigna
    }
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          
          {/* Usa el componente PrivateRoute para proteger las rutas */}
          <Route element={<PrivateRoute />}>
            <Route path="/invertir" element={
              <>
                <Header /> {/* Header solo aparece en rutas privadas */}
                <InvestmentForm userName={userName} userBalance={userBalance} />
              </>
            } />
            <Route path="/noticias" element={
              <>
                <Header /> {/* Header solo aparece en rutas privadas */}
                <FinancialNews />
              </>
            } />
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
