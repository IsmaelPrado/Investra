// src/components/UserProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: string | null;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Estado para controlar el menú del perfil
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <li className="relative">
      <button
        onClick={toggleProfileMenu}
        className="text-lg font-bold hover:text-blue-400 flex items-center"
      >
        <span className="material-icons">person</span> {/* Cambiar "Perfil" por el ícono de usuario */}
      </button>
      {isProfileMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-gradient-to-r from-gray-800 to-black rounded-lg shadow-lg p-4 z-50"
          onClick={() => setIsProfileMenuOpen(false)} // Cierra el menú al hacer clic en cualquier lugar del menú
        >
          <h2 className="text-md font-bold text-white mb-2">{JSON.parse(user!).nombre}</h2>
          <p className="text-xs font-semibold text-gray-300 mb-4">
            {JSON.parse(user!).correo}
          </p>
          <p className="text-xs font-semibold text-gray-300 mb-4">
            ${JSON.parse(user!).saldo}
          </p>
          <div className="mt-2">
            <button className="w-full px-3 py-1 bg-white text-gray-800 font-semibold rounded hover:bg-gray-200 transition">
              Editar Perfil
            </button>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-3 py-1 mt-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </li>
  );
};

export default UserProfile;
