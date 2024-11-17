import React, { useEffect, useMemo, useState } from 'react';
import { Asset } from '../../services/api';
import PriceHistoryChart from '../Charts/PriceHistoryChart';
import ActivoDetalles from './AssetDetails';
import { useSocket } from '../../context/SocketContext'; // Importa el hook
import ComprarModal from './BuyAsset';
import ComprarBonosModal from './BuyBond';


interface PriceData {
    id: number;
    prices: number[];
    timestamps: string[];
}

interface ActivosListProps {
    activos: Asset[];
    priceData: PriceData[];
}

const ActivosList: React.FC<ActivosListProps> = ({ activos: initialActivos, priceData }) => {
    const [activos, setActivos] = useState<Asset[]>(initialActivos);
    const [selectedActivo, setSelectedActivo] = useState<Asset | null>(null);

    const [activoParaComprar, setActivoParaComprar] = useState<Asset | null>(null); // Estado para el modal de compra
    const [bonoParaComprar, setBonoParaComprar] = useState<Asset | null>(null); // Estado para el modal de compra
    const socket = useSocket(); // Usa el hook para obtener el socket

    useEffect(() => {
        setActivos(initialActivos);
    }, [initialActivos]);
    useEffect(() => {
        if (socket) {
            socket.on('updateAssets', (activosActualizados: Asset[]) => {
                console.log('Datos recibidos de activos actualizados:', activosActualizados);
                setActivos(activosActualizados);
            });
        

            return () => {
                socket.off('updateAssets'); // Limpia el 
            };
        }
    }, [socket]);
    const acciones = useMemo(() => activos.filter((activo) => activo.tipo === 'accion'), [activos]);
    const bonosGubernamentales = useMemo(() => activos.filter((activo) => activo.tipo === 'bono_gubernamental'), [activos]);
    const bonosOrganizacionales = useMemo(() => activos.filter((activo) => activo.tipo === 'bono_organizacional'), [activos]);

    const handleBack = () => {
        setSelectedActivo(null);
    };

    // Función para determinar la clase de color según el rendimiento y cambio porcentual
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
    const handleComprarBonoClick = (bono: Asset) => {
        setBonoParaComprar(bono);
    };
 
    const handleCompraExitosa = () => {
        // Opcional: Puedes actualizar el estado de activos o mostrar una notificación
        // Por ahora, simplemente actualizamos los activos desde el socket
        // O puedes implementar una función para recargar los activos
        setActivoParaComprar(null); // Cierra el modal después de una compra exitosa
        setBonoParaComprar(null);
    };

    if (selectedActivo) {
        return <ActivoDetalles activo={selectedActivo} onBack={handleBack} />;
    }


    return (
        <div className="min-h-screen p-6 bg-gray-900">
            <h2 className="text-4xl font-bold text-green-400 text-center mb-6">Mercado Financiero</h2>

            {/* Modal de Compra */}
            {activoParaComprar && (
                <ComprarModal
                    activo={activoParaComprar}
                    onClose={() => setActivoParaComprar(null)}
                    onSuccess={handleCompraExitosa}
                />
            )}

   {/* Modal de Compra */}
   {bonoParaComprar && (
                <ComprarBonosModal
                    activo={bonoParaComprar}
                    onClose={() => setBonoParaComprar(null)}
                    onSuccess={handleCompraExitosa}
                />
            )}

            <div className="mb-8">
                <h3 className="text-3xl font-semibold text-white mb-4">Acciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {acciones.map((activo: Asset) => {
                        const historialPrecios = activo.historialPrecios || [];
                        const ultimos5Precios = historialPrecios.slice(-5); // Filtra los últimos 5 precios
                        const rendimientoAbsoluto = activo.rendimientoAbsoluto || 0; // Default to 0 if undefined
                        const cambioPorcentual = activo.cambioPorcentual || 0; // Default to 0 if undefined

                        return (
                            <div key={activo.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">

                            <h4 className="text-2xl font-semibold text-blue-400">{activo.nombre}</h4>
                                <p className="text-lg font-semibold text-gray-200">
                                    Precio Actual: <span className="text-blue-500 text-2xl font-bold">${activo.precio}</span>
                                </p>
                                <p className="text-gray-400">Tipo: {activo.tipo}</p>
                                <p className="text-gray-400">
                                    Rendimiento Absoluto: <span className={`${getRendimientoClass(rendimientoAbsoluto)} font-bold`}>{rendimientoAbsoluto}</span>
                                </p>
                                <p className="text-gray-400">
                                    Cambio Porcentual: <span className={`${getCambioClass(cambioPorcentual)} font-bold`}>{cambioPorcentual}%</span>
                                </p>
                                {ultimos5Precios.length > 0 && (
                                    <PriceHistoryChart historialPrecios={ultimos5Precios} />
                                )}
                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                        onClick={() => handleComprarClick(activo)} // Llama a la función de compra
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                        onClick={() => setSelectedActivo(activo)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-semibold text-white mb-4">Bonos Gubernamentales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bonosGubernamentales.map((activo: Asset) => {
                        const historialPrecios = activo.historialPrecios || [];
                        const ultimos5Precios = historialPrecios.slice(-5); // Filtra los últimos 5 precios
                        const rendimientoAbsoluto = (activo.rendimientoAbsoluto || 0); // Default to '0' if undefined
                        const cambioPorcentual = (activo.cambioPorcentual || 0); // Default to '0' if undefined

                        return (
                            <div key={activo.id} className="bg-gray-800 border border-gray-600 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                <h4 className="text-2xl font-semibold text-green-300">{activo.nombre}</h4>
                                <p className="text-lg font-semibold text-gray-100">
                                    Precio Actual: <span className="text-green-300 text-2xl font-bold">${activo.precio}</span>
                                </p>
                                <p className="text-gray-300">Tipo: {activo.tipo}</p>
                                <p className="text-gray-300">
                                    Rendimiento Absoluto: <span className={`${getRendimientoClass(rendimientoAbsoluto)} font-bold`}>{rendimientoAbsoluto}</span>
                                </p>
                                <p className="text-gray-300">
                                    Cambio Porcentual: <span className={`${getCambioClass(cambioPorcentual)} font-bold`}>{cambioPorcentual}%</span>
                                </p>
                                {ultimos5Precios.length > 0 && (
                                    <PriceHistoryChart historialPrecios={ultimos5Precios} />
                                )}
                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                        onClick={() => handleComprarBonoClick(activo)} // Llama a la función de compra
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                        onClick={() => setSelectedActivo(activo)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-semibold text-white mb-4">Bonos Organizacionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bonosOrganizacionales.map((activo: Asset) => {
                        const historialPrecios = activo.historialPrecios || [];
                        const ultimos5Precios = historialPrecios.slice(-5); // Filtra los últimos 5 precios
                        const rendimientoAbsoluto = (activo.rendimientoAbsoluto || 0); // Default to '0' if undefined
                        const cambioPorcentual = (activo.cambioPorcentual || 0); // Default to '0' if undefined

                        return (
                            <div key={activo.id} className="bg-gray-800 border border-gray-600 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                <h4 className="text-2xl font-semibold text-yellow-400">{activo.nombre}</h4>
                                <p className="text-lg font-semibold text-gray-100">
                                    Precio Actual: <span className="text-yellow-300 text-2xl font-bold">${activo.precio}</span>
                                </p>
                                <p className="text-gray-300">Tipo: {activo.tipo}</p>
                                <p className="text-gray-300">
                                    Rendimiento Absoluto: <span className={`${getRendimientoClass(rendimientoAbsoluto)} font-bold`}>{rendimientoAbsoluto}</span>
                                </p>
                                <p className="text-gray-300">
                                    Cambio Porcentual: <span className={`${getCambioClass(cambioPorcentual)} font-bold`}>{cambioPorcentual}%</span>
                                </p>
                                {ultimos5Precios.length > 0 && (
                                    <PriceHistoryChart historialPrecios={ultimos5Precios} />
                                )}
                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                        onClick={() => handleComprarBonoClick(activo)} // Llama a la función de compra
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                        onClick={() => setSelectedActivo(activo)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ActivosList;
