// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Investra from '../assets/Investra.png';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 text-white shadow-lg z-50">
      <nav className="flex justify-between items-center">
        <div className="flex items-center ml-4">
          <Link to="/">
            <img src={Investra} alt="Investra logo" className="w-32 h-auto" />
          </Link>
        </div>
        <ul className="flex space-x-4 mr-4 items-center">
          {user ? (
            <>
              <li>
                <Link
                  to="/invertir"
                  className="flex items-center text-sm hover:opacity-70 transition-opacity duration-200 py-2 px-4 border border-white rounded-md"
                >
                  <span className="material-icons mr-2">trending_up</span>
                  Invertir
                </Link>
              </li>
              <li>
                <Link
                  to="/noticias"  // Enlace a noticias
                  className="flex items-center text-sm hover:opacity-70 transition-opacity duration-200 py-2 px-4 border border-white rounded-md"
                >
                  <span className="material-icons mr-2">school</span> {/* Icono para noticias */}
                  Academia
                </Link>
              </li>
              <UserProfile user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-lg font-bold bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-200">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registro" className="text-lg font-bold bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition duration-200">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
