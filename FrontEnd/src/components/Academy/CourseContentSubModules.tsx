import { useEffect, useState } from 'react';
import { fetchSubModuleCourse } from '../../services/coursePurchasedService';
import { useUser } from '../../context/UserContext';
import YouTube from 'react-youtube';
import ReactMarkdown from 'react-markdown';

interface Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

interface Submodule {
    submoduloid: number;
    moduloid: number;
    submodulonombre: string;
    tipocontenido: 'video' | 'lectura' | 'ambos' | 'ninguno' | 'examen';
    urlcontenido?: string;
    urlimagen?: string;
    textocontenido?: string;
    questions?: Question[];
}

interface CourseSubModuleProps {
    courseId: number;
    moduleId: number;
}

const CourseSubModule: React.FC<CourseSubModuleProps> = ({ courseId, moduleId }) => {
    const { user } = useUser();
    const [submodules, setSubModules] = useState<Submodule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        const getSubModules = async () => {
            if (courseId) {
                try {
                    const allSubmodules = await fetchSubModuleCourse(courseId);
                    const filteredSubmodules = (allSubmodules as Submodule[]).filter((submodule) => submodule.moduloid === moduleId);
                    setSubModules(filteredSubmodules);
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Error desconocido');
                } finally {
                    setLoading(false);
                }
            }
        };

        getSubModules();
    }, [courseId, moduleId, user]);

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: answer,
        }));
    };

    const handleSubmitExam = () => {
        setShowResults(true);
    };

    const calculateScore = (questions: Question[]) => {
        return questions.reduce((score, question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                return score + 1;
            }
            return score;
        }, 0);
    };

    const renderFormattedText = (text: string) => {
        // Dividir en párrafos por saltos de línea
        const paragraphs = text.split('\n');

        return paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-300 mt-2 text-lg">
                {
                    // Detectar y aplicar negrita al texto entre ** **
                    paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <span key={i} className="font-bold">{part.replace(/\*\*/g, '')}</span>;
                        }
                        return part;
                    })
                }
            </p>
        ));
    };

    if (loading) {
        return <p className="text-center text-lg text-blue-300">Cargando submódulos...</p>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{`Error: ${error}`}</div>;
    }

    const opts = {
        height: '480',
        width: '720',
        playerVars: { autoplay: 0 },
    };

    return (
        <div className="p-4 h-screen overflow-y-auto bg-gray-900 text-white">
            {submodules.length > 0 ? (
                <div className="space-y-8">
                    {submodules.map((submodule) => (
                        <div key={submodule.submoduloid} className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col">
                            <h2 className="text-3xl font-semibold text-blue-400 mb-6">{submodule.submodulonombre}</h2>

                            {submodule.tipocontenido === 'video' && submodule.urlcontenido ? (
                                <div className="flex-grow mb-6 flex justify-center">
                                    <div className="w-full max-w-2xl">
                                        <YouTube videoId={submodule.urlcontenido.split('v=')[1]} opts={opts} />
                                    </div>
                                </div>
                            ) : submodule.tipocontenido === 'lectura' && submodule.textocontenido ? (
                                <div className="flex-grow mb-2 p-4 bg-gray-700 rounded-lg">
                                    {renderFormattedText(submodule.textocontenido)}
                                </div>
                            ) : submodule.tipocontenido === 'examen' && submodule.textocontenido ? (
                                <div className="flex-grow mb-2">
                                    {submodule.textocontenido.split('\n').map((option, index) => (
                                        <label key={index} className="block mb-2">
                                            <input
                                                type="radio"
                                                name={`question-${submodule.submoduloid}`}
                                                value={option}
                                                checked={selectedAnswers[submodule.submoduloid] === option}
                                                onChange={() => handleAnswerSelect(submodule.submoduloid, option)}
                                                className="mr-2"
                                            />
                                            {option}
                                        </label>
                                    ))}
                                    <button
                                        onClick={handleSubmitExam}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                                    >
                                        Enviar Examen
                                    </button>
                                    {showResults && (
                                        <div className="mt-4 text-center text-lg text-blue-400">
                                            <p>Has enviado tus respuestas.</p>
                                        </div>
                                    )}
                                </div>
                            ) : submodule.tipocontenido === 'ninguno' && submodule.urlimagen ? (
                                <div className="flex-grow mb-2">
                                    <img src={submodule.urlimagen} alt={submodule.submodulonombre} className="mt-2 w-full rounded-lg" />
                                </div>
                            ) : (
                                <p className="text-center text-blue-500">No hay contenido disponible para este submódulo.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-blue-500">No hay submódulos disponibles para este curso.</p>
            )}
        </div>
    );
};

export default CourseSubModule;
