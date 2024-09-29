// src/components/RegisterForm.tsx

import React, { useState } from 'react';
import { RegisterResponse } from '../types'; // Ajusta la ruta según tu estructura

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de llamada a API para registro
    const response = await fakeRegisterApi(username, email, password);

    if (response.success) {
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setError(null);
    } else {
      setError(response.message || 'Error desconocido');
      setSuccess(null);
    }
  };

  const fakeRegisterApi = (username: string, email: string, password: string): Promise<RegisterResponse> => {
    // Simulando una API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username && email && password) {
          resolve({ success: true, message: 'Usuario registrado' });
        } else {
          resolve({ success: false, message: 'Por favor completa todos los campos' });
        }
      }, 1000);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Registro de Usuario</h2>
        
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

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
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
