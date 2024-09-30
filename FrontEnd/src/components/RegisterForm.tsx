import React, { useState } from 'react';
import { registerUser } from '../services/userService'; // Importar el servicio
import { showToast } from '../services/toastrService'; // Importar la función para mostrar mensajes
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Investra.png'; // Importar el logotipo desde la carpeta assets

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

    // Nueva función para redirigir al login
    const goToLogin = () => {
        navigate('/login'); // Redirigir a la página de login
    };

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col justify-center items-center">
            {/* Encabezado con el logotipo y el enlace */}
            <header className="absolute top-0 w-full flex justify-between items-center p-4">
                {/* Logotipo en la parte superior izquierda */}
                <div className="flex items-center">
                    <img src={logo} alt="Logotipo" className="h-8 mt-4 ml-10" /> {/* Ajusta el tamaño del logotipo según sea necesario */}
                </div>

                {/* Enlace para iniciar sesión en la parte superior derecha */}
                <div className='flex items-center p-10'>
                <h2 className='mr-2'>¿Ya estás registrado?</h2>
                    <button
                        onClick={goToLogin}
                        className="text-blue-500 hover:underline text-lg"
                    >
                         <strong>Inicia sesión</strong>
                    </button>
                </div>
            </header>

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md mt-16">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Crea tu registro
                </h2>
                <p className='mb-10 text-sm'>Te damos la bienvenida a la plataforma que impulsa tu potencial financiero.</p>

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
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
