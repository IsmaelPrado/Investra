import React, { useState, useEffect } from 'react';
import InvestmentResults from './InvestmentResults'; // Asegúrate de importar el nuevo componente
import { showToast } from '../services/toastrService'; 

const InvestmentForm: React.FC = () => {
  useEffect(() => {
    // Verificar si hay que mostrar el toast de éxito
    const showSuccessToast = localStorage.getItem('showSuccessToast');
    if (showSuccessToast) {
        showToast('Inicio de sesión exitoso', 'success');
        // Limpiar la bandera de localStorage
        localStorage.removeItem('showSuccessToast');
    }
}, []);
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = (amount * Math.pow(1 + interestRate / 100, duration)).toFixed(2);
    setSimulationResult(parseFloat(result));
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg w-full max-w-md">
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
    </div>
  );
};

export default InvestmentForm;
