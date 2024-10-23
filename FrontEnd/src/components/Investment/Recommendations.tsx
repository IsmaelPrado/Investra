import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { obtenerRecomendaciones } from "../../services/interviewProfileService";
import PriceHistoryChart from "../Charts/PriceHistoryChart";
import { Asset } from "../../services/api";
import ActivoDetalles from "../Simulation/AssetDetails";
import ComprarModal from '../Simulation/BuyAsset';

interface RecomendacionesProps {
    userId: number;
    activos: any[]; // Prop para recibir los activos
}

const Recommendations: React.FC<RecomendacionesProps> = ({ userId, activos }) => {
    const [recomendaciones, setRecomendaciones] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activoParaComprar, setActivoParaComprar] = useState<Asset | null>(null); // Estado para el modal de compra
    const [selectedActivo, setSelectedActivo] = useState<Asset | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0); // Para el control del índice del carrusel
    const itemsPerPage = 1; // Puedes cambiar este valor para mostrar más de un activo por vez
    const socket = useSocket();

    const handleBack = () => {
        setSelectedActivo(null);
    };

    useEffect(() => {
        const fetchRecomendaciones = async () => {
            try {
                const data = await obtenerRecomendaciones(userId);
                setRecomendaciones(data);
            } catch (error) {
                console.error("Error al obtener recomendaciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecomendaciones();

        if (!socket) return;

        socket.on("updateRecommendations", (newRecommendations) => {
            setRecomendaciones(newRecommendations);
        });

        return () => {
            socket.off("updateRecommendations");
        };
    }, [userId, socket]);

    // Intervalo para cambiar de slide automáticamente
    useEffect(() => {
        const intervalId = setInterval(() => {
            handleNext();
        }, 5000); // Cambia cada 5000 ms (5 segundos)

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
    }, [currentSlide]); // Se reinicia si el índice actual cambia

    if (loading) {
        return <div>Cargando recomendaciones...</div>;
    }

    // Comparar activos recomendados con los activos disponibles
    const activosRecomendadosConDetalles = recomendaciones.activosRecomendados.map((recomendado: any) => {
        const activoDetalles = activos.find((activo) => activo.id === recomendado.id);
        return activoDetalles ? { ...recomendado, ...activoDetalles } : recomendado;
    });

    const totalSlides = Math.ceil(activosRecomendadosConDetalles.length / itemsPerPage);

    const getRendimientoClass = (rendimiento: number) => {
        if (rendimiento < 0) return 'text-red-500'; // Rendimiento negativo
        if (rendimiento >= 0 && rendimiento < 2) return 'text-yellow-500'; // Rendimiento bajo
        return 'text-green-500'; // Rendimiento alto
    };

    const getCambioClass = (cambio: number) => {
        if (cambio < 0) return 'text-red-500'; // Cambio porcentual negativo
        if (cambio >= 0 && cambio < 2) return 'text-yellow-500'; // Cambio porcentual bajo
        return 'text-green-500'; // Cambio porcentual alto
    };

    const handleComprarClick = (activo: Asset) => {
        setActivoParaComprar(activo);
    };
    const handleCompraExitosa = () => {
        // Opcional: Puedes actualizar el estado de activos o mostrar una notificación
        // Por ahora, simplemente actualizamos los activos desde el socket
        // O puedes implementar una función para recargar los activos
        setActivoParaComprar(null); // Cierra el modal después de una compra exitosa
    };

    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    const handlePrev = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    const currentActivos = activosRecomendadosConDetalles.slice(
        currentSlide * itemsPerPage,
        (currentSlide + 1) * itemsPerPage
    );

    // Colores predefinidos para el nombre del activo
    const coloresNombres = [
        'text-red-500',
        'text-blue-500',
        'text-green-500',
        'text-yellow-500',
        'text-purple-500',
        'text-pink-500',
    ];

    // Función para obtener un color aleatorio
    const getRandomColorClass = () => {
        const randomIndex = Math.floor(Math.random() * coloresNombres.length);
        return coloresNombres[randomIndex];
    };

    if (selectedActivo) {
        return <ActivoDetalles activo={selectedActivo} onBack={handleBack} />;
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg mb-6 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white">Recomendaciones</h2>
               {/* Modal de Compra */}
               {activoParaComprar && (
                <ComprarModal
                    activo={activoParaComprar}
                    onClose={() => setActivoParaComprar(null)}
                    onSuccess={handleCompraExitosa}
                />
            )}
            <p className="text-xl text-gray-300">Inversión Recomendada: ${recomendaciones.inversionDisponible.toFixed(2)}</p>

            <div className="relative">
                <div className="flex justify-center items-center ">
                    <button 
                        onClick={handlePrev} 
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        Anterior
                    </button>
                    
                    {currentActivos.map((activo: any) => {
                        const historialPrecios = activo.historialPrecios || [];
                        const ultimos5Precios = historialPrecios.slice(-5);
                        const rendimientoAbsoluto = (activo.rendimientoAbsoluto || 0);
                        const cambioPorcentual = (activo.cambioPorcentual || 0);

                        return (
                            <div key={activo.id} className="bg-gray-800 border border-gray-600 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 w-full mx-auto mb-8">
                                <h4 className={`text-3xl font-semibold ${getRandomColorClass()}`}>{activo.nombre}</h4>
                                <p className="text-2xl font-semibold text-gray-100">
                                    Precio Actual: <span className="text-yellow-300 text-3xl font-bold">${activo.precio}</span>
                                </p>
                                <p className="text-xl text-gray-300">Tipo: {activo.tipo}</p>
                                <p className="text-xl text-gray-300">
                                    Rendimiento Absoluto: <span className={`${getRendimientoClass(rendimientoAbsoluto)} font-bold`}>{rendimientoAbsoluto}</span>
                                </p>
                                <p className="text-xl text-gray-300">
                                    Cambio Porcentual: <span className={`${getCambioClass(cambioPorcentual)} font-bold`}>{cambioPorcentual}%</span>
                                </p>
                                {ultimos5Precios.length > 0 && (
                                    <PriceHistoryChart historialPrecios={ultimos5Precios} />
                                )}
                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                                        onClick={() => handleComprarClick(activo)} 
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                                        onClick={() => setSelectedActivo(activo)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <button 
                        onClick={handleNext} 
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        Siguiente
                    </button>
                </div>

                {/* Indicadores */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <span 
                            key={index} 
                            className={`w-3 h-3 mx-1 rounded-full ${index === currentSlide ? 'bg-yellow-400' : 'bg-gray-400'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
