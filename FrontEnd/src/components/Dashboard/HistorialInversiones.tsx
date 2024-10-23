import React, { useEffect, useState } from 'react';
import { obtenerHistorialPorUsuario } from '../../services/historyAssetsService';
import { useUser } from '../../context/UserContext';

interface HistorialActivo {
    id?: number | undefined;
    usuario_id: number;
    activo_id: number;
    cantidad: number;
    precio_venta: number;
    fecha_venta: Date;
    ganancia: number | undefined;
    estado: string;
    tipo_activo: string;
}

const HistorialInversiones: React.FC = () => {
    const { user } = useUser();
    const [historial, setHistorial] = useState<HistorialActivo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const historialUsuario = await obtenerHistorialPorUsuario(user.id);
                    setHistorial(historialUsuario);
                } catch (error) {
                    setError('Error al obtener el historial de inversiones.');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No se pudo identificar al usuario.');
            }
        };

        fetchHistorial();
    }, [user]);

    if (loading) return <div className="text-center text-xl text-gray-300">Cargando historial...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Historial de Inversiones</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Activo ID</th>
                            <th className="py-3 px-6 text-left">Cantidad</th>
                            <th className="py-3 px-6 text-left">Fecha de Venta</th>
                            <th className="py-3 px-6 text-left">Precio de Compra</th>
                            
                            <th className="py-3 px-6 text-left">Precio de Venta</th>
                            <th className="py-3 px-6 text-left">Estado</th>
                            <th className="py-3 px-6 text-left">Tipo de Activo</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-sm font-light">
                        {historial.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                                <td className="py-4 px-6">{item.activo_id}</td>
                                <td className="py-4 px-6">{item.cantidad}</td>
                                <td className="py-4 px-6">{new Date(item.fecha_venta).toLocaleString()}</td>
                                <td className="py-4 px-6">${item.precio_venta}</td>
                              
                                <td className={`py-4 px-6 font-bold ${item.ganancia && item.ganancia > item.precio_venta ? 'text-green-400' : 'text-red-400'}`}>
                                    ${item.ganancia ?? 'N/A'}
                                </td>
                                <td className="py-4 px-6">{item.estado}</td>
                                <td className="py-4 px-6">{item.tipo_activo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialInversiones;
