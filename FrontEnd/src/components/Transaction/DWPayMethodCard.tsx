import React, { useEffect, useState } from 'react';
import { getBilleteraDigitalPorUsuario, eliminarBilleteraDigital } from '../../services/paymentMethodService';
import { FaWallet, FaTimes } from 'react-icons/fa';

interface Billetera {
    id: number;
    direccion_billetera: string;
    user_id: number;
}

interface PaymentMethodsCardsProps {
    userId: number;
    onWalletClick: (billetera: Billetera) => void; // Función para manejar el clic en la billetera
}

const DWPayMethodCard: React.FC<PaymentMethodsCardsProps> = ({ userId, onWalletClick }) => {
    const [billeteras, setBilleteras] = useState<Billetera[]>([]);
    const [billeteraError, setBilleteraError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [billeteraToDelete, setBilleteraToDelete] = useState<Billetera | null>(null);

    useEffect(() => {
        const fetchBilleteras = async () => {
            try {
                const billetera = await getBilleteraDigitalPorUsuario(userId);
                console.log("Respuesta de getBilleteraDigitalPorUsuario:", billetera);

                if (billetera.message) {
                    setBilleteraError(billetera.message);
                } else {
                    setBilleteras(billetera);
                    setBilleteraError(null);
                }
            } catch (error) {
                console.error("Error al obtener billeteras:", error);
                setBilleteraError("No hay billeteras disponibles.");
            }
        };

        fetchBilleteras();
    }, [userId]);

    const handleDeleteClick = (billetera: Billetera) => {
        setBilleteraToDelete(billetera);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (billeteraToDelete) {
            try {
                await eliminarBilleteraDigital(billeteraToDelete.id);
                setBilleteras(prev => prev.filter(b => b.id !== billeteraToDelete.id)); // Actualiza la lista de billeteras
                setModalVisible(false);
            } catch (error) {
                console.error("Error al eliminar la billetera:", error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-900">
            {billeteras.length > 0 ? (
                <div>
                    <h4 className="font-semibold mb-4 text-white">Mis Billeteras</h4>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {billeteras.map((billetera) => (
                            <div
                                key={billetera.id}
                                className="bg-gray-800 shadow-xl rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer flex-none w-40 relative"
                                onClick={() => onWalletClick(billetera)} // Llama a la función cuando se hace clic
                            >
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evitar que el click cierre el modal
                                        handleDeleteClick(billetera);
                                    }}
                                >
                                    <FaTimes />
                                </button>
                                <div className="flex items-center mb-4">
                                    <FaWallet className="text-blue-500 text-3xl mr-4" />
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Dirección: <br></br><span className="text-blue-400 break-all">{billetera.direccion_billetera}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : billeteraError ? (
                <div className="text-gray-400">{billeteraError}</div>
            ) : (
                <div className="text-gray-400">No hay billeteras disponibles.</div>
            )}

            {modalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                        <h2 className="text-white text-lg mb-4">Confirmar Eliminación</h2>
                        <p className="text-gray-400">¿Estás seguro de que deseas eliminar la billetera de dirección {billeteraToDelete?.direccion_billetera}?</p>
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

export default DWPayMethodCard;
