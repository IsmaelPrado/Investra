import React, { useEffect, useState } from 'react';
import { getBilleteraDigitalPorUsuario } from '../../services/paymentMethodService';
import { FaWallet } from 'react-icons/fa';

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
                setBilleteraError("Error al obtener las billeteras.");
            }
        };

        fetchBilleteras();
    }, [userId]);

    return (
        <div className="p-4 bg-gray-900">
            {billeteras.length > 0 ? (
                <div>
                    <h4 className="font-semibold mb-4 text-white">Mis Billeteras</h4>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {billeteras.map((billetera) => (
                            <div
                                key={billetera.id}
                                className="bg-gray-800 shadow-xl rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer flex-none w-40"
                                onClick={() => onWalletClick(billetera)} // Llama a la función cuando se hace clic
                            >
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
                <div className="text-red-500">{billeteraError}</div>
            ) : (
                <div className="text-gray-400">No hay billeteras disponibles.</div>
            )}
        </div>
    );
};

export default DWPayMethodCard;
