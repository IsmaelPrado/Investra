import React, { useState } from 'react';
import { loginUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../services/toastrService';
import VerificationModal from './VerificationModal'; // Importar el nuevo componente modal

const LoginForm: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await loginUser(correo, contraseña);
            
            if (response.usuario) {
                // Login exitoso
                localStorage.setItem('user', JSON.stringify(response.usuario));
                localStorage.setItem('showSuccessToast', 'true'); // Guardar bandera de éxito
                window.location.href = '/invertir'; // Redirigir
            } else {
                // Si el token ha expirado
                setMensaje(response.mensaje);
                setShowVerificationModal(true); // Mostrar modal
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error'); // Mostrar error
            } else {
                showToast('Ocurrió un error inesperado.', 'error'); // Mostrar error genérico
            }
        }
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Iniciar Sesión</h2>

                <div className="mb-4">
                    <label htmlFor="correo" className="block text-gray-300">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="contraseña" className="block text-gray-300">Contraseña:</label>
                    <input
                        type="password"
                        id="contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
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

            {showVerificationModal && (
                <VerificationModal mensaje={mensaje} correo={correo} onClose={() => setShowVerificationModal(false)} />
            )}
        </div>
    );
};

export default LoginForm;
