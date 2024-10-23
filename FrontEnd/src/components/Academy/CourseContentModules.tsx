import { useEffect, useState } from 'react';
import { fetchModuleCourse } from '../../services/coursePurchasedService';
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import { MdSchool } from 'react-icons/md';
import CourseSubModule from './CourseContentSubModules';

interface Module {
    moduloid: number;
    cursoid: number;
    nombre: string;
    tipocontenido: 'examen' | 'video' | 'lectura' | 'ambos' | 'ninguno'; // Agrega tipocontenido para saber si es de examen
}

const CourseContent: React.FC = () => {
    const { user } = useUser();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { courseId } = useParams<{ courseId: string }>();
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isExamModule, setIsExamModule] = useState<boolean>(false);

    useEffect(() => {
        const getModules = async () => {
            if (courseId) {
                try {
                    const modules = await fetchModuleCourse(Number(courseId));
                    setModules(modules);
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Error desconocido');
                } finally {
                    setLoading(false);
                }
            }
        };

        getModules();
    }, [courseId, user]);

    const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
        setIsExamModule(module.tipocontenido === 'examen'); // Actualiza el estado para mostrar el botón si es de examen
    };

    const handleSubmitExam = () => {
        alert('Examen enviado');
    };

    if (loading) {
        return <p className="text-center text-lg text-gray-300">Cargando contenido...</p>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{`Error: ${error}`}</div>;
    }

    return (
        <div className="flex main-content">
            <div className="w-1/4 bg-gray-800 p-4 h-screen sticky top-0 overflow-y-auto shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Módulos</h2>
                <ul>
                    {modules.map((module) => (
                        <li
                            key={module.moduloid}
                            onClick={() => handleModuleClick(module)}
                            className={`flex items-center p-2 mb-2 rounded-lg shadow-md cursor-pointer transition ${
                                selectedModule?.moduloid === module.moduloid
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-blue-900 text-blue-200 hover:bg-blue-700'
                            }`}
                        >
                            <MdSchool className="mr-2" />
                            <span>{module.nombre}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/4 p-4 bg-gray-900 text-blue-100">
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
                    Contenido del Curso {courseId}
                </h1>
                {selectedModule ? (
                    <>
                        <CourseSubModule courseId={Number(courseId)} moduleId={selectedModule.moduloid} />
                        {isExamModule && (
                            <button
                                onClick={handleSubmitExam}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                            >
                                Enviar Examen
                            </button>
                        )}
                    </>
                ) : (
                    <p className="text-center text-blue-200">Selecciona un módulo para ver su contenido.</p>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
