import { useEffect, useState } from 'react';
import { fetchModuleCourse } from '../../services/coursePurchasedService';
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import { MdSchool } from 'react-icons/md'; // Cambiado a icono de "School"
import CourseSubModule from './CourseContentSubModules';


interface Module {
    moduloid: number; // ID del módulo
    cursoid: number; // Referencia a Course
    nombre: string; // Nombre del módulo
}

const CourseContent: React.FC = () => {
    const { user } = useUser();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { courseId } = useParams<{ courseId: string }>(); // Obtener el courseId de la URL
    const [selectedModule, setSelectedModule] = useState<Module | null>(null); // Para almacenar el módulo seleccionado

    useEffect(() => {
        const getModules = async () => {
            if (courseId) {
                try {
                    const modules = await fetchModuleCourse(Number(courseId));
                    setModules(modules);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError('Error desconocido');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        getModules();
    }, [courseId, user]);

    const handleModuleClick = (module: Module) => {
        setSelectedModule(module); // Almacena el módulo seleccionado
    };

    if (loading) {
        return <p className="text-center text-lg">Cargando contenido...</p>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
    }

    return (
        <div className='flex main-content'>
            <div className='w-1/4 bg-gray-300 p-4 h-screen sticky top-0 overflow-y-auto shadow-lg'> {/* Sidebar con posición sticky */}
                <h2 className="text-xl font-bold mb-4 text-gray-800">Módulos</h2>
                <ul>
                    {modules.map((module) => (
                        <li
                            key={module.moduloid}
                            onClick={() => handleModuleClick(module)}
                            className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition"
                        >
                            <MdSchool className="text-gray-800 mr-2" />
                            <span className="text-gray-800">{module.nombre}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='w-3/4 p-4'> {/* Contenido del curso */}
                <h1 className="text-4xl font-bold mb-8 text-center">Contenido del Curso {courseId}</h1>
                {selectedModule ? (
                    <CourseSubModule courseId={Number(courseId)} moduleId={selectedModule.moduloid} />
                ) : (
                    <p className="text-center">Selecciona un módulo para ver su contenido.</p>
                )}
            </div>
        </div>
    );
    
};

export default CourseContent;
