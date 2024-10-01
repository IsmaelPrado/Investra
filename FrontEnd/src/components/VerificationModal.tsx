import React, { useState } from 'react';
import { verificarCodigo } from '../services/verificationService';  // Importa el servicio
import { showToast } from '../services/toastrService';

interface VerificationModalProps {
    correo: string;  // Ahora necesitas pasar el correo como prop
    mensaje: string;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ correo, mensaje, onClose }) => {
    const [codigo, setCodigo] = useState(['', '', '', '', '', '']);  // Estado para manejar los 6 inputs
    const [isLoading, setIsLoading] = useState(false);  // Estado para manejar la carga

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]?$/.test(value)) {  // Permitir solo números de un dígito
            const newCodigo = [...codigo];
            newCodigo[index] = value;
            setCodigo(newCodigo);

            // Mover automáticamente al siguiente input si se ingresa un número
            if (value && index < 5) {
                (document.getElementById(`input-${index + 1}`) as HTMLInputElement).focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const codigoCompleto = codigo.join('');  // Unir todos los valores de los inputs en un solo string
            const response = await verificarCodigo(correo, codigoCompleto);

            if (response.token) {
                // Guardar el token y el usuario en el localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.usuario));

                showToast(response.mensaje, 'success');
                onClose();  // Cerrar el modal
            } else {
                showToast('Código de verificación incorrecto', 'error');
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);  // Detener la carga
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Verificación requerida</h2>
                <p className="mb-4 text-gray-300">{mensaje}</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-4">
                        {codigo.map((num, index) => (
                            <input
                                key={index}
                                type="text"
                                id={`input-${index}`}
                                value={codigo[index]}
                                onChange={(e) => handleChange(e, index)}
                                className="w-12 h-12 text-center text-2xl bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                                maxLength={1}  // Solo permitir un número por input
                                inputMode="numeric"  // Mostrar teclado numérico en dispositivos móviles
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition duration-200 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}  // Desactivar el botón mientras carga
                    >
                        {isLoading ? 'Verificando...' : 'Verificar'}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-4 text-red-500 hover:underline w-full"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default VerificationModal;
