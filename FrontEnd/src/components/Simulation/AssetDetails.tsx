import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext'; // Importa el hook del contexto
import { Asset, PriceHistory } from '../../services/api'; // Asegúrate de que ambos tipos estén importados
import PriceHistoryChart from '../Charts/PriceHistoryChart';

interface ActivoDetallesProps {
    activo: Asset;
    onBack: () => void;
}

const ActivoDetalles: React.FC<ActivoDetallesProps> = ({ activo: initialActivo, onBack }) => {
    const [activo, setActivo] = useState<Asset>(initialActivo);
    const [cantidadCambios, setCantidadCambios] = useState<number>(5); // Estado para la cantidad de cambios
    const [historialPreciosFiltrado, setHistorialPreciosFiltrado] = useState<PriceHistory[]>([]); // Estado para el historial filtrado
    const socket = useSocket(); // Usa el socket compartido desde el contexto

    useEffect(() => {
        setActivo(initialActivo); // Establece el estado inicial al montar
    }, [initialActivo]); // Asegúrate de incluir initialActivo como dependencia

    useEffect(() => {
        if (!socket) return;

        const handleUpdateAssets = (updatedActivos: Asset[]) => {
            console.log('Activos actualizados recibidos:', updatedActivos);
            const updatedActivo = updatedActivos.find(a => a.id === activo.id);
            if (updatedActivo) {
                setActivo(updatedActivo); // Actualiza el estado con el activo actualizado
            }
        };

        socket.on('updateAssets', handleUpdateAssets);
        
        return () => {
            socket.off('updateAssets', handleUpdateAssets); // Limpiar el listener cuando el componente se desmonta
        };
        
    }, [socket, activo.id]); // Incluye activo.id como dependencia

    useEffect(() => {
        // Filtra el historial de precios según la cantidad seleccionada
        const historialPrecios = activo.historialPrecios || [];
        if (cantidadCambios === -1) {
            setHistorialPreciosFiltrado(historialPrecios); // Mostrar historial completo
        } else {
            setHistorialPreciosFiltrado(historialPrecios.slice(-cantidadCambios));
        }
    }, [cantidadCambios, activo.historialPrecios]); // Actualiza cuando cambia la cantidad o el historial

    const rendimientoAbsoluto = (activo.rendimientoAbsoluto || '0');
    const cambioPorcentual = (activo.cambioPorcentual || '0');

    // Función para manejar el cambio de la cantidad de cambios seleccionados
    const handleCantidadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Number(event.target.value);
        setCantidadCambios(selectedValue);
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <button onClick={onBack} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mb-4">
                Volver
            </button>
            <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold text-green-400 text-center mb-4">{activo.nombre}</h2>
                <p className="text-xl text-gray-200">Tipo: <span className="text-yellow-400 font-semibold">{activo.tipo}</span></p>
                <p className="text-xl text-gray-200 mt-2">
                    Precio Actual: <span className="text-blue-500 font-bold">${activo.precio}</span>
                </p>
                <p className="text-xl text-gray-200 mt-2">
                    Rendimiento Absoluto: <span className="text-blue-500 font-bold">{(rendimientoAbsoluto || 0)}</span>
                </p>
                <p className="text-xl text-gray-200 mt-2">
                    Cambio Porcentual: 
                    <span className={`font-bold ${(typeof cambioPorcentual === 'string' ? parseFloat(cambioPorcentual) : cambioPorcentual) >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {(typeof cambioPorcentual === 'string' ? parseFloat(cambioPorcentual) : cambioPorcentual)}%
                    </span>
                </p>
            </div>

            {/* Combo Box para seleccionar la cantidad de cambios */}
            <div className="mt-6 max-w-lg mx-auto bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-white mb-2">Seleccionar Cantidad de Cambios</h3>
                <select
                    value={cantidadCambios}
                    onChange={handleCantidadChange}
                    className="border border-gray-600 p-2 rounded w-full bg-gray-700 text-white"
                >
                    <option value={5}>Últimos 5</option>
                    <option value={10}>Últimos 10</option>
                    <option value={20}>Últimos 20</option>
                    <option value={50}>Últimos 50</option>
                    <option value={-1}>Historial Completo</option> {/* Opción para mostrar historial completo */}
                </select>
            </div>

            {historialPreciosFiltrado.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">Historial de Precios</h3>
                    <PriceHistoryChart historialPrecios={historialPreciosFiltrado} />
                </div>
            )}
        </div>
    );
};

export default ActivoDetalles;
