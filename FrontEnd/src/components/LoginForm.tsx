// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { LoginResponse } from '../types'; // Ajusta la ruta según tu estructura
import { useUser } from '../context/UserContext'; // Importa el contexto

const LoginForm: React.FC = () => {
  const { setUser } = useUser(); // Obtiene la función para actualizar el usuario
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de llamada a API para autenticación
    const response = await fakeLoginApi(email, password);

    if (response.success) {
      // Asegúrate de que response.data esté definido antes de acceder a él
      if (response.data && response.data.user) {
        setUser({ username: response.data.user, email }); // Puedes personalizar esto
        console.log('Inicio de sesión exitoso', response.data);
      } else {
        setError('Error en la respuesta del servidor');
      }
    } else {
      setError(response.message || 'Error desconocido');
    }
  };

  const fakeLoginApi = (email: string, password: string): Promise<LoginResponse> => {
    // Simulando una API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'vansestilo200@gmail.com' && password === 'linux') {
          resolve({ success: true, data: { user: 'Ismael Prado' } });
        } else {
          resolve({ success: false, message: 'Credenciales inválidas' });
        }
      }, 1000);
    });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Iniciar Sesión</h2>
        
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-300">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
