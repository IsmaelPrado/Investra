// src/components/UserProfile.tsx

import React from 'react';
import { useUser } from '../context/UserContext'; // Importa el contexto

const UserProfile: React.FC = () => {
  const { user } = useUser(); // Obtiene el usuario del contexto

  if (!user) {
    return <div className="text-center text-gray-400">Por favor inicia sesión para ver tu perfil.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-md bg-gray-800 border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Perfil del Usuario</h2>
      <p className="text-lg font-semibold text-gray-300">Nombre de Usuario: {user.nombre}</p>
      <p className="text-lg font-semibold text-gray-300">Correo Electrónico: {user.correo}</p>
    </div>
  );
};

export default UserProfile;
