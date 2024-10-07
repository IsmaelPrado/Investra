// src/components/InvestmentForm.tsx
import React, { useState, useEffect } from 'react';
import InvestmentResults from './InvestmentResults';
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

  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);  // Estado para abrir/cerrar el modal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = (amount * Math.pow(1 + interestRate / 100, duration)).toFixed(2);
    setSimulationResult(parseFloat(result));
  };

  return (
    <div className=" ">
      {/* Mostrar el nombre y el saldo del usuario en la parte superior */}
      <div className=" p-4 rounded-lg  mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Hola, {userName}!</h1>
        <p className="text-2xl text-gray-300">Saldo disponible: ${userBalance.toFixed(2)}</p>
          {/* Botón para realizar una transacción */}
          <button
            onClick={() => setIsModalOpen(true)}  // Abre el modal al hacer clic
            className="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-200"
          >
            Realizar Transacción
          </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Simulación de Inversión</h2>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-300">Monto de Inversión ($):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-300">Duración (años):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="interestRate" className="block text-gray-300">Tasa de Interés (%):</label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition duration-200"
        >
          Simular Inversión
        </button>
      </form>

      <InvestmentResults 
        amount={amount} 
        duration={duration} 
        interestRate={interestRate} 
        result={simulationResult} 
      />

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
