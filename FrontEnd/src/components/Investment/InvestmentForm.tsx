// src/components/InvestmentForm.tsx
import React, { useState, useEffect } from 'react';
import TransactionModal from '../Transaction/TransactionModal';  // Importa el modal de transacción
import { showToast } from '../../services/toastrService';

interface InvestmentFormProps {
  userName: string; // Nombre del usuario
  userBalance: number; // Saldo del usuario
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ userName, userBalance }) => {
  useEffect(() => {
    const showSuccessToast = localStorage.getItem('showSuccessToast');
    if (showSuccessToast) {
      showToast('Inicio de sesión exitoso', 'success');
      localStorage.removeItem('showSuccessToast');
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);  // Estado para abrir/cerrar el modal


  return (
    <div className="main-content ">
      {/* Mostrar el nombre y el saldo del usuario en la parte superior */}
      <div className=" p-4 rounded-lg  mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Hola, {userName}!</h1>
        <p className="text-2xl text-gray-300">Saldo disponible: ${userBalance.toFixed(2)}</p>
          {/* Botón para realizar una transacción */}
          <button
            onClick={() => setIsModalOpen(true)}  // Abre el modal al hacer clic
            className="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-200"
          >
            Meter Fondos
          </button>
      </div>

    

      {/* Modal de transacción */}
      {isModalOpen && (
        <TransactionModal 
          userBalance={userBalance} 
          onClose={() => setIsModalOpen(false)}  // Cerrar el modal
        />
      )}
    </div>
  );
};

export default InvestmentForm;
