import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-xl font-bold mb-4">Confirmar Transacción</h2>
                <p className="mb-4">¿Estás seguro de que deseas realizar un depósito desde el método de pago seleccionado?</p>
                <p className="mb-4 text-gray-300">Verifica que todos los datos sean correctos antes de continuar.</p>
                <div className="flex justify-between">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-400">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
