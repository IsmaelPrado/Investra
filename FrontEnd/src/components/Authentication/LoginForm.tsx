import React, { useState } from 'react';
import { loginUser } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../services/toastrService';
import VerificationModal from './VerificationModal'; // Importar el nuevo componente modal
import loginImage from '../../assets/image.jpeg'; // Importar la imagen para el lado derecho
import logo from '../../assets/Investra.png'; // Importar la imagen del logo
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar iconos de ojo

const LoginForm: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidad de la contraseña
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

    // Nueva función para redirigir al registro
    const goToRegister = () => {
        navigate('/registro'); // Redirigir a la página de registro
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="h-screen w-screen flex">
            {/* Contenedor izquierdo para el formulario */}
            <div className="w-1/3 bg-gray-900 flex justify-center items-center relative">
                {/* Logo en la esquina superior izquierda */}
                <img src={logo} alt="Logo" className="absolute top-10 left-10 h-6" />
                
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-10 shadow-lg w-4/5 max-w-sm">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>

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

                    <div className="mb-4 relative">
                        <label htmlFor="contraseña" className="block text-gray-300">Contraseña:</label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Cambia el tipo de input según el estado
                            id="contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                        {/* Botón de ojo para mostrar/ocultar contraseña */}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-9 text-gray-400 hover:text-gray-300"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition duration-200"
                    >
                        Iniciar Sesión
                    </button>

                    {/* Nueva sección para el enlace a registrarse */}
                    <div className="mt-4 text-center text-gray-300">
                        <p>¿Aún no te registras?</p>
                        <button
                            onClick={goToRegister}
                            className="text-blue-500 hover:underline mt-1"
                        >
                            Crea tu registro
                        </button>
                    </div>

                </form>
            </div>
            {showVerificationModal && (
                <VerificationModal mensaje={mensaje} correo={correo} onClose={() => setShowVerificationModal(false)} />
            )}
            {/* Contenedor derecho para la imagen */}
            <div className="w-2/3 bg-gray-200 flex justify-center items-center">
                <img src={loginImage} alt="Login" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default LoginForm;
