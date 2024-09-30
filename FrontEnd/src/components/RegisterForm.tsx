// src/components/RegisterForm.tsx

import React, { useState } from 'react';
import { registerUser } from '../services/userService'; // Importar el servicio
import { showToast } from '../services/toastrService'; // Importar la función para mostrar mensajes
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await registerUser(username, email, password);
            showToast(response.message, 'success'); // Mostrar mensaje de éxito
            navigate('/login'); // Redirigir a la página de login o donde desees
        } catch (err: unknown) {
            if (err instanceof Error) {
                showToast(err.message, 'error'); // Mostrar mensaje de error
            } else {
                showToast('Ocurrió un error inesperado.', 'error'); // Mensaje de error genérico
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Registro de Usuario</h2>

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
