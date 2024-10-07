import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import InvestmentForm from './components/InvestmentForm';
import LoginForm from './components/LoginForm';
import ProfileInterview from './components/ProfileInterview';
import './index.css'; 
import RegisterForm from './components/RegisterForm'; 
import { UserProvider } from './context/UserContext'; 
import React, { useEffect, useState } from 'react';
import PrivateRoute from './components/PrivateRoute'; // Importa el componente PrivateRoute
import PublicRoute from './components/PublicRoute'; // Importa el componente PublicRoute
import 'toastr/build/toastr.min.css'; // Importar estilos de Toastr
//import FinancialNews from './components/Academy/Academy';
import { useNavigate } from 'react-router-dom';  // Asegúrate de importar useNavigate

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

const AppRoutes: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const navigate = useNavigate(); // Ahora puedes usar useNavigate aquí

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const currentPath = window.location.pathname;
  
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.nombre);
      setUserBalance(Number(user.saldo));
  
      if (currentPath === '/' || currentPath === '/login') {
        navigate('/invertir');
      }
    } else if (currentPath !== '/login' && currentPath !== '/registro') {
      navigate('/login');
    }
  }, [navigate]);
  
  

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />

      {/* Usa el componente PrivateRoute para proteger las rutas */}
      <Route element={<PrivateRoute />}>
      
        <Route
          path="/invertir"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <InvestmentForm userName={userName} userBalance={userBalance} />
            </>
          }
        />
        <Route
          path="/noticias"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
            
            </>
          }
        />
      </Route>

      {/* Usa el componente PublicRoute para proteger las rutas de login y registro */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route
          path="/encuesta"
          element={
          <ProfileInterview />  
          }
          />
      </Route>

      {/* Redirigir a login si no hay usuario y se intenta acceder a rutas protegidas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;