import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import SkipConfirmationModal from './CloseMessage';  // Importa el componente de confirmación

const Quiz: React.FC = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill('')); // Para almacenar respuestas
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false); // Para mostrar el modal de confirmación

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
      question: '¿Qué porcentaje de tus ahorros estás dispuesto a invertir en activos de riesgo (acciones y bonos)?',
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

  // Nueva función para redirigir al registro
  const goToRegister = () => {
    navigate('/login'); // Redirigir a la página de registro
  };

  const handleFinish = () => {
    goToRegister(); // Redirigir al finalizar
  };

  const handleSkip = () => {
    setShowSkipConfirmation(true);  // Mostrar el modal de confirmación
  };

  const cancelSkip = () => {
    setShowSkipConfirmation(false); // Cierra el modal si el usuario cancela
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirmation(false); // Oculta el modal
    goToRegister(); // Redirigir al omitir
  };

  // Cálculo del porcentaje de progreso
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-4">
        
      {/* Círculo rojo con una "X" para cancelar */}
      <div className="absolute top-16 right-4" style={{ right: '400px' }}>
        <button
          onClick={handleSkip} // Llama a la misma función de "omitir"
          className="text-white duration-200 p-8"
        >
          <span className="text-xxl">✖</span> {/* Aumentar el tamaño de la X */}
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">{questions[currentQuestion].question}</h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`p-4 border rounded-lg transition-all duration-200 w-full ${
              answers[currentQuestion] === option ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleOptionSelect(option)}  // Seleccionar opción
            onDoubleClick={() => {                      // Doble clic para avanzar
              handleOptionSelect(option);  // Selecciona la opción
              nextQuestion();              // Avanza a la siguiente pregunta
            }}
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

      {/* Botón para omitir el formulario */}
      <div className="mt-4">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-200 text-sm"
        >
          Omitir
        </button>
      </div>

      {/* Renderizar el modal de confirmación solo si está visible */}
      {showSkipConfirmation && (
        <SkipConfirmationModal
          onConfirm={handleConfirmSkip} // Cambia aquí para que llame a la función que redirige
          onCancel={cancelSkip}  // Cierra el modal cuando se cancela
        />
      )}
    </div>
  );
};

export default Quiz;
