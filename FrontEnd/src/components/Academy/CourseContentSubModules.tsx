import { useEffect, useState } from 'react';
import { fetchSubModuleCourse } from '../../services/coursePurchasedService';
import { useUser } from '../../context/UserContext';
import YouTube from 'react-youtube'; // Importa el componente de YouTube

interface Submodule {
    submoduloid: number; // ID del submódulo
    moduloid: number; // Referencia a Module
    submodulonombre: string; // Nombre del submódulo
    tipocontenido: 'video' | 'lectura' | 'ambos' | 'ninguno'; // Tipo de contenido que se presenta
    urlcontenido?: string; // URL del video o contenido multimedia
    urlimagen?: string; // URL de la imagen asociada (si existe)
    textocontenido?: string; // Texto del contenido de aprendizaje
}

interface CourseSubModuleProps {
    courseId: number;
    moduleId: number; // Añadido moduleId como prop
}

const CourseSubModule: React.FC<CourseSubModuleProps> = ({ courseId, moduleId }) => {
    const { user } = useUser();
    const [submodules, setSubModules] = useState<Submodule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSubModules = async () => {
            if (courseId) {
                try {
                    const allSubmodules = await fetchSubModuleCourse(courseId);
                    // Filtra submódulos por moduleId
                    const filteredSubmodules = (allSubmodules as Submodule[]).filter((submodule) => submodule.moduloid === moduleId);
                    setSubModules(filteredSubmodules);
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

        getSubModules();
    }, [courseId, moduleId, user]); // Agregar moduleId a las dependencias

    if (loading) {
        return <p className="text-center text-lg text-gray-300">Cargando submódulos...</p>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
    }

    const opts = {
        height: '480', // Ajusta la altura
        width: '720', // Ajusta el ancho
        playerVars: {
            // Opciones del reproductor de YouTube
            autoplay: 0, // Cambia a 1 para reproducir automáticamente
        },
    };

    return (
        <div className="p-4 h-screen overflow-y-auto">
            {submodules.length > 0 ? (
                <div className="space-y-8"> {/* Aumentar el espacio vertical entre tarjetas */}
                    {submodules.map((submodule) => (
                        <div key={submodule.submoduloid} className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col"> {/* Aumentar margen inferior */}
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6"> {/* Aumentar margen inferior del título */}
                                {submodule.submodulonombre}
                            </h2> {/* Título del submódulo */}
                            
                            {submodule.tipocontenido === 'video' && submodule.urlcontenido ? (
                                <div className="flex-grow mb-6 flex justify-center"> {/* Espacio superior e inferior alrededor del video */}
                                    <div className="w-full max-w-2xl"> {/* Ajusta el ancho máximo */}
                                        <YouTube videoId={submodule.urlcontenido.split('v=')[1]} opts={opts} /> {/* Usar el componente YouTube */}
                                    </div>
                                </div>
                            ) : submodule.tipocontenido === 'lectura' && submodule.textocontenido ? (
                                <div className="flex-grow mb-2">
                                    <p className="text-gray-600 mt-2 text-lg">{submodule.textocontenido}</p>
                                </div>
                            ) : submodule.tipocontenido === 'ninguno' && submodule.urlimagen ? (
                                <div className="flex-grow mb-2">
                                    <img src={submodule.urlimagen} alt={submodule.submodulonombre} className="mt-2 w-full rounded-lg" />
                                </div>
                            ) : (
                                <p className="text-center text-gray-300">No hay contenido disponible para este submódulo.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-300">No hay submódulos disponibles para este curso.</p>
            )}
        </div>
    );
};

export default CourseSubModule;
