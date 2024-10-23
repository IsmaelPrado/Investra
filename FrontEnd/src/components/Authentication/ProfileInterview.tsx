import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { obtenerPreguntasEncuesta, EncuestaPregunta, guardarRespuestasEncuesta } from '../../services/interviewProfileService'; 
import SkipConfirmationModal from './CloseModal'; // Asegúrate de que la ruta sea correcta
import { useUser } from "../../context/UserContext";
import { showToast } from '../../services/toastrService';
import { loginUserWithEmail } from '../../services/userService';

interface ProfileInterviewProps{
    onClose: () => void;
}
const ProfileInterview: React.FC<ProfileInterviewProps> = ({onClose}) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<EncuestaPregunta[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const { user } = useUser(); // Obtiene el usuario del contexto

  const opcionesPreguntas: { [key: number]: { texto: string; valor: string }[] } = {
    1: [
      { texto: "Bajo", valor: "B" },
      { texto: "Moderado", valor: "M" },
      { texto: "Alto", valor: "A" },
    ],
    4: [
      { texto: "Menos de 1 día", valor: "-1" },
      { texto: "1-3 días", valor: "3" },
      { texto: "Más de 3 días", valor: "+3" },
    ],
  };

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const data = await obtenerPreguntasEncuesta();
        setQuestions(data);
        setAnswers(Array(data.length).fill('')); 
      } catch (error) {
        setError('Hubo un error al cargar las preguntas.');
      } finally {
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, []);

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

  const handleFinish = async () => {
    if (!user) {
      console.error('Usuario no encontrado.');
      return; // Manejar el caso en que no hay usuario
    }

    const respuestasConPreguntas = questions.map((question, index) => ({
        id_pregunta: question.id,
        respuesta: answers[index],
    }));
    
    try {
      await guardarRespuestasEncuesta({
        id_usuario: user.id, // Usa el ID del usuario desde el contexto
        respuestas: respuestasConPreguntas,
      });
      showToast('Respuestas guardadas exitosamente', 'success');
      localStorage.removeItem("user");
      const loginResponse = await loginUserWithEmail(user.correo);
      localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
      onClose(); // Cierra el modal después de guardar
      window.location.reload();
    } catch (error) {
      showToast('Error al guardar respuestas: ' + error, 'error');
    }
  };


  const handleSkip = () => {
    setShowSkipConfirmation(true); 
  };

  const cancelSkip = () => {
    setShowSkipConfirmation(false); 
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirmation(false);
    onClose(); // Llama a la función onClose para cerrar el modal de perfil
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return <p>Cargando preguntas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-4">
      <div className="absolute top-16 right-4">
        <button onClick={handleSkip} className="text-white duration-200 p-8">
            <span className="text-xxl">✖</span>
        </button>
      </div>

      {/* Texto fijo sobre el cuestionario */}
      <div className="mb-8 text-center">
        <p className="text-lg mb-6 text-center bg-gray-800 p-4 rounded-lg shadow-md">
  Este es un cuestionario sobre inversión. Es necesario responder todas las preguntas para poder realizar algunas posibles recomendaciones basadas en tus respuestas.
</p>

      </div>

      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
      {questions[currentQuestion].tipo_respuesta === 'numerico' && questions[currentQuestion].id === 2 && (
  <div className="relative">
    <input
      type="number"
      className="p-4 border rounded-lg w-full text-right bg-gray-700 text-white"
      value={answers[currentQuestion] || ''}
      placeholder="Introduce tu salario mensual"
      onChange={(e) => handleOptionSelect(e.target.value)}
    />
  </div>
)}


{questions[currentQuestion].texto}</h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
        {questions[currentQuestion].tipo_respuesta === 'opcion_multiple' && 
          opcionesPreguntas[questions[currentQuestion].id]?.map((option, index) => (
            <button
              key={index}
              className={`p-4 border rounded-lg transition-all duration-200 w-full ${
                answers[currentQuestion] === option.valor ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => handleOptionSelect(option.valor)}
              onDoubleClick={() => {
                handleOptionSelect(option.valor);
                nextQuestion();
              }}
            >
              {option.texto}
            </button>
          ))
        }

{questions[currentQuestion].tipo_respuesta === 'numerico' && questions[currentQuestion].id === 3 && (
  <div className="relative">
    <select
      className="p-4 border rounded-lg w-full bg-gray-700 text-white"
      value={answers[currentQuestion] || ''}
      onChange={(e) => handleOptionSelect(e.target.value)}
    >
      <option value="" disabled>Selecciona un porcentaje</option>
      <option value="5">5%</option>
      <option value="10">10%</option>
      <option value="20">20%</option>
      <option value="30">30%</option>
      <option value="40">40%</option>
      <option value="50">50%</option>
    </select>
  </div>
)}


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
            disabled={!answers[currentQuestion]}
            className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded ${
              !answers[currentQuestion] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!answers[currentQuestion]}
            className={`bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded ${
              !answers[currentQuestion] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Finalizar
          </button>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-200 text-sm"
        >
          Omitir
        </button>
      </div>

      {showSkipConfirmation && (
        <SkipConfirmationModal
          onConfirm={handleConfirmSkip}
          onCancel={cancelSkip}
        />
      )}
    </div>
  );
};

export default ProfileInterview;
