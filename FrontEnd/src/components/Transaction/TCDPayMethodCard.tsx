import React, { useEffect, useState } from 'react';
import { getTarjetaCreditoPorUsuario, eliminarTarjetaCredito } from '../../services/paymentMethodService';
import { FaRegCreditCard, FaTimes } from 'react-icons/fa';

interface Tarjeta {
    id: number;
    numero_tarjeta: string;
    fecha_vencimiento: number;
    cvv: number;
    nombre_titular: string;
    user_id: number;
}

interface PaymentMethodsCardsProps {
    userId: number;
    onCardClick: (tarjeta: Tarjeta) => Promise<void>; // Función para manejar el clic en la billetera
}

const TCDPayMethodCard: React.FC<PaymentMethodsCardsProps> = ({ userId, onCardClick }) => {
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
    const [tarjetaError, setTarjetaError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [tarjetaToDelete, setTarjetaToDelete] = useState<Tarjeta | null>(null);

    useEffect(() => {
        const fetchTarjetas = async () => {
            try {
                const tarjeta = await getTarjetaCreditoPorUsuario(userId);
                console.log("Respuesta de getTarjetaCreditoPorUsuario:", tarjeta);

                if (tarjeta.message) {
                    setTarjetaError(tarjeta.message);
                } else {
                    setTarjetas(tarjeta);
                    setTarjetaError(null);
                }
            } catch (error) {
                console.error("Error al obtener tarjetas:", error);
                setTarjetaError("No hay tarjetas disponibles.");
            }
        };

        fetchTarjetas();
    }, [userId]);

    // Función para censurar el número de la tarjeta
    const censurarNumeroTarjeta = (numero: string) => {
        return `${numero.slice(0, 4)} **** **** ${numero.slice(-4)}`; // Muestra los primeros 4 y los últimos 4 dígitos
    };

    const handleDeleteClick = (tarjeta: Tarjeta) => {
        setTarjetaToDelete(tarjeta);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (tarjetaToDelete) {
            try {
                await eliminarTarjetaCredito(tarjetaToDelete.id);
                setTarjetas(prev => prev.filter(t => t.id !== tarjetaToDelete.id)); // Actualiza la lista de tarjetas
                setModalVisible(false);
            } catch (error) {
                console.error("Error al eliminar la tarjeta:", error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-900">
            {tarjetas.length > 0 ? (
                <div>
                    <h4 className="font-semibold mb-4 text-white">Mis Tarjetas</h4>
                    <div className="overflow-x-auto flex space-x-4">
                        {tarjetas.map((tarjeta) => (
                            <div
                                key={tarjeta.id}
                                className="flex-none w-1/2 bg-gray-800 shadow-xl rounded-lg p-4 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer" // Ajustado el ancho de la tarjeta
                                onClick={() => onCardClick(tarjeta)} // Llama a la función cuando se hace clic
                            >
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evitar que el click cierre el modal
                                        handleDeleteClick(tarjeta);
                                    }}
                                >
                                    <FaTimes />
                                </button>
                                <div className="flex items-center mb-2">
                                    <FaRegCreditCard className="text-blue-500 text-3xl mr-2" />
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Número Tarjeta: <span className="text-blue-400 break-all">{censurarNumeroTarjeta(tarjeta.numero_tarjeta)}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Fecha de Vencimiento: <span className="text-blue-400">{tarjeta.fecha_vencimiento}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Titular: <span className="text-blue-400">{tarjeta.nombre_titular || "No disponible"}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : tarjetaError ? (
                <div className="text-gray-400">{tarjetaError}</div>
            ) : (
                <div className="text-gray-400">No hay tarjetas disponibles.</div>
            )}

            {modalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                        <h2 className="text-white text-lg mb-4">Confirmar Eliminación</h2>
                        <p className="text-gray-400">¿Estás seguro de que deseas eliminar la tarjeta de {tarjetaToDelete?.nombre_titular}?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-700 text-white px-4 py-2 rounded"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TCDPayMethodCard;
