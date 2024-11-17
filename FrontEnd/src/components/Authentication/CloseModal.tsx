import React from 'react';

interface SkipConfirmationModalProps {
  onConfirm: () => void;  // Lógica para confirmar la omisión
  onCancel: () => void;   // Lógica para cancelar
}

const SkipConfirmationModal: React.FC<SkipConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">¿Omitir el formulario?</h2>
        <p className="mb-6">
          ¿Estás seguro de que deseas omitir el formulario? Las respuestas seleccionadas no serán
          almacenadas.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
          >
            Omitir
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipConfirmationModal;