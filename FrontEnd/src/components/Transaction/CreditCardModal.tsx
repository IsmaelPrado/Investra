import React from 'react';
import CreditCard from './CreditCard';

interface CreditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountInfo: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        porpose: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
    onConfirm: () => void; // Añadido para el botón "Realizar transacción"
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ isOpen, onClose, accountInfo, setAccountInfo, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-60">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white relative">
                {/* Botón de cerrar */}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Cerrar Modal"
                >
                    &times;
                </button>

                {/* Título del modal */}
                <h2 className="text-xl font-bold mb-4">Nueva tarjeta de crédito/débito</h2>
                
                {/* Componente para ingresar los detalles de la tarjeta */}
                <CreditCard accountInfo={accountInfo} setAccountInfo={setAccountInfo} />

                {/* Botones de acción */}
                <div className="flex justify-end mt-6">
                    <button 
                        onClick={onClose} 
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={onConfirm} // Accion para realizar la transacción
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Realizar transacción
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreditCardModal;
