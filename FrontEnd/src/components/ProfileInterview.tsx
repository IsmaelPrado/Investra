import React, { useState } from 'react';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill('')); // Para almacenar respuestas

  const questions = [
    {
      question: '¿Cuál es tu principal objetivo al invertir?',
      options: [
        'Seguridad: Mantener mi capital seguro, incluso si las ganancias son bajas.',
        'Crecimiento moderado: Obtener ganancias estables sin tomar grandes riesgos.',
        'Crecimiento agresivo: Maximizar mis ganancias, aunque implique mayores riesgos.',
      ],
    },
    {
      question: '¿Qué tan cómodo te sientes ante la posibilidad de perder dinero en el corto plazo?',
      options: [
        'Nada cómodo: Prefiero evitar cualquier pérdida de capital.',
        'Moderadamente cómodo: Puedo tolerar pequeñas pérdidas temporales.',
        'Muy cómodo: Estoy dispuesto a asumir pérdidas significativas si existe el potencial de ganar más a largo plazo.',
      ],
    },
    {
      question: '¿Cuánto tiempo planeas mantener tus inversiones antes de necesitar el dinero?',
      options: ['Menos de 1 año.', 'Entre 1 y 3 años.', 'Más de 3 años.'],
    },
    {
      question: 'Si tu inversión bajara un 15% en un mes, ¿cómo reaccionarías?',
      options: [
        'Vendería inmediatamente para evitar mayores pérdidas.',
        'Mantendría la inversión, esperando que se recupere con el tiempo.',
        'Invertiría más dinero para aprovechar precios más bajos.',
      ],
    },
    {
      question:
        '¿Qué porcentaje de tus ahorros estás dispuesto a invertir en activos de riesgo (acciones, criptomonedas, etc.)?',
      options: ['Menos del 10%.', 'Entre 10% y 30%.', 'Más del 30%.'],
    },
  ];

  const handleOptionSelect = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    console.log('Respuestas del usuario:', answers);
    alert('Has finalizado el cuestionario.');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{questions[currentQuestion].question}</h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`p-4 border rounded-lg transition-all duration-200 w-full ${
              answers[currentQuestion] === option ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8 w-full max-w-xl">
        {currentQuestion > 0 && (
          <button
            onClick={previousQuestion}
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Atrás
          </button>
        )}
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion]} // Deshabilitar si no se selecciona una opción
            className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ${
              !answers[currentQuestion] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!answers[currentQuestion]} // Deshabilitar si no se selecciona una opción
            className={`bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded ${
              !answers[currentQuestion] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
