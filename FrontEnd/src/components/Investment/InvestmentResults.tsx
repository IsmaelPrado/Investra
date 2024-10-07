import React from 'react';

interface InvestmentResultsProps {
  amount: number;
  duration: number;
  interestRate: number;
  result: number | null;
}

const InvestmentResults: React.FC<InvestmentResultsProps> = ({ amount, duration, interestRate, result }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Resultados de la Simulación</h2>
      
      {result !== null ? (
        <div>
          <div className="text-gray-300 mb-2">
            <strong>Monto Invertido:</strong> ${amount}
          </div>
          <div className="text-gray-300 mb-2">
            <strong>Duración:</strong> {duration} años
          </div>
          <div className="text-gray-300 mb-2">
            <strong>Tasa de Interés:</strong> {interestRate}%
          </div>
          <div className="text-green-400 font-semibold text-xl">
            <strong>Valor Futuro de la Inversión:</strong> ${result.toFixed(2)}
          </div>
          {/* Aquí puedes agregar un gráfico si lo deseas */}
        </div>
      ) : (
        <p className="text-gray-300">No hay resultados disponibles. Realiza una simulación.</p>
      )}
    </div>
  );
};

export default InvestmentResults;
