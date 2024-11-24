import React, { useEffect, useState } from 'react';
import { comprarActivoService, getAssetById } from '../../services/buyAssetsService';
import { useUser } from '../../context/UserContext';
import { useSocket } from '../../context/SocketContext';
import PriceHistoryChartCompras from '../Charts/PriceHistoryChartCompras';
import { HistorialActivo, crearHistorialInversion, obtenerHistorialPorUsuario } from '../../services/historyAssetsService';
import { loginUserWithEmail } from '../../services/userService';
import { showToast } from '../../services/toastrService';
import LoadingModal from '../Transaction/LoadingModal';
import HistorialInversiones from './HistorialInversiones';

interface Activo {
    id: number;
    nombre: string;
    tipo: 'accion' | 'bono' | 'bono_organizacional' | 'bono_gubernamental';
    precio: number;
    min_variacion: number;
    max_variacion: number;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}

interface CompraActivo {
    id?: number;
    usuario_id: number;
    activo_id: number;
    cantidad?: number;
    precio_compra: number;
    fecha_compra?: Date;
    fecha_vencimiento?: Date | null;
    estado: 'comprado' | 'vendido' | 'vencido';
    fecha_venta?: Date | null;
    tipo_activo: 'accion' | 'bono';
    precio_actual?: number;
    ganancia_perdida?: number;
    rendimientoPorcentual?: number;
    totalInversion?: number;
    historialPreciosCompra: PriceHistoryCompras[];
}

export interface PriceHistoryCompras {
    precio_final: number;
    fecha_final: string;
}




interface DashboardInversionesProps {
    usuarioId?: number;
}

const DashboardInversiones: React.FC<DashboardInversionesProps> = ({ usuarioId }) => {
    const [compras, setCompras] = useState<CompraActivo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const socket = useSocket();
    const [activos, setActivos] = useState<Map<number, Activo>>(new Map());
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedActivo, setSelectedActivo] = useState<CompraActivo | null>(null);
    const [historial, setHistorial] = useState<HistorialActivo[]>([]);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);


    useEffect(() => {
        const obtenerCompras = async () => {
            try {
                setLoading(true);
                const idUsuario = usuarioId || user?.id;
                if (idUsuario) {
                    const comprasUsuario = await comprarActivoService.obtenerComprasPorUsuario(idUsuario);
                    setCompras(comprasUsuario);

                    // Obtener activos para cada compra
                    const activosPromesas = comprasUsuario.map(compra => 
                        getAssetById(compra.activo_id)
                    );
                    const activosObtenidos = await Promise.all(activosPromesas);
                    
                    // Mapear activos a su ID para fácil acceso
                    const activosMap = new Map<number, Activo>();
                    activosObtenidos.forEach(activo => activosMap.set(activo.id, activo));
                    setActivos(activosMap);
                     // Obtener historial de inversiones
console.log(activosObtenidos);
                     const historialUsuario = await obtenerHistorialPorUsuario(user?.id);
                     setHistorial(historialUsuario);
                } else {
                    setError('No se pudo identificar al usuario.');
                }
            } catch (error) {
                setError('Hubo un error al obtener las inversiones.');
            } finally {
                setLoading(false);
            }
        };

        if (user || usuarioId) {
            obtenerCompras();
        }

        if (socket) {
            socket.on('updateInvestments', (inversionesActualizadas: CompraActivo[]) => {
                setCompras((prevCompras) => 
                  prevCompras.map((compra) => {
                    const updatedInversion = inversionesActualizadas.find(inversion => inversion.id === compra.id);
                   
                    return updatedInversion ? { ...compra, ...updatedInversion } : compra;
                  })
                );
             });
             
        }

        return () => {
            if (socket) {
                socket.off('updateInvestments');
            }
        };
    }, [usuarioId, user, socket]);

    const handleSellClick = (compra: CompraActivo) => {
        setSelectedActivo(compra);
        setShowModal(true);
    };

    const handleConfirmSell = async () => {
        if (!selectedActivo || !user || !user?.correo) return;
    
        // Remueve el localStorage y realiza el login
        localStorage.removeItem("user");
        if (user) {
            try {
                const loginResponse = await loginUserWithEmail(user.correo);
                localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
            } catch {
                showToast('El token ha expirado, vuelve a iniciar sesión', 'warning');
                window.location.reload();
                return;
            }
        }
    
        // Crear el nuevo historial de inversión
        const nuevoHistorial: HistorialActivo = {
            usuario_id: selectedActivo.usuario_id,
            activo_id: selectedActivo.activo_id,
            precio_venta: selectedActivo.precio_compra || 0,
            fecha_venta: new Date(),
            cantidad: selectedActivo.cantidad || 0,
            ganancia: selectedActivo.ganancia_perdida,
            estado: 'vendido',
            tipo_activo: selectedActivo.tipo_activo
        };

         // Abre el modal de carga
         setIsLoadingModalOpen(true); 
        setTimeout(async () => {
        try {
            await crearHistorialInversion(nuevoHistorial, selectedActivo.id!);
            setCompras(prev => prev.filter(compra => compra.id !== selectedActivo.id));
            setHistorial(prev => [...prev, nuevoHistorial]); // Añadir al historial local
    
            setIsLoadingModalOpen(false); // Cierra el modal de carga
    
            // Espera de 3 segundos
            
                try {
                    localStorage.removeItem("user");
                    const loginResponse = await loginUserWithEmail(user?.correo);
                    localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
                    window.location.reload(); // Recarga la página
                } catch {
                    showToast('El token ha expirado, vuelve a iniciar sesión', 'warning');
                    window.location.reload();
                }
          
    
        } catch (error) {
            setError('Error al vender el activo.');
            console.error(error);
        } finally {
            // Este bloque no debe cerrar el modal de carga inmediatamente
            setShowModal(false);
            setSelectedActivo(null);
            // El modal de carga se cerrará después de 3 segundos
        }  }, 3000); // Tiempo de espera de 3 segundos
    };
    
    

    if (loading) {
        return <div className="text-blue-300">Cargando inversiones...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const acciones = compras.filter(compra => compra.tipo_activo === 'accion');
    const bonos = compras.filter(compra => 
        compra.tipo_activo === 'bono');
    
    return (
        <div className="main-content min-h-screen p-6 bg-gray-900">
            <h1 className="text-4xl font-bold text-green-400 text-center mb-6">Mis inversiones actuales</h1>

            <div className="mb-8">
                <h2 className="text-3xl font-semibold text-white mb-4">Acciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {acciones.length > 0 ? (
                        acciones.map((accion) => {
                            const activo = activos.get(accion.activo_id); // Obtener el activo relacionado
                            const historialPrecios = accion.historialPreciosCompra || [];
                            const ultimos5Precios = historialPrecios.slice(-5); 
                            
                            return (
                                <div key={accion.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                    <h3 className="text-lg font-semibold text-blue-200">{activo?.nombre}</h3>
                                    <div className="flex justify-between">
                                        <p>Cantidad: <span className="text-blue-300">{accion.cantidad}</span></p>
                                        <p className="font-semibold">Estado:
                                            <span className={`capitalize ${accion.estado === 'vendido' ? 'text-red-500' : 'text-green-500'}`}>{accion.estado}</span>
                                        </p>
                                    </div>
                                    <p>Precio de compra: <span className="text-blue-300">${accion.precio_compra}</span></p>
                                    <p>Precio actual: <span className="text-blue-300">${accion.precio_actual}</span></p>
                                    <p>Rendimiento: <span className={`font-bold ${accion.rendimientoPorcentual! >= 0 ? 'text-green-500' : 'text-red-500'}`}>{accion.rendimientoPorcentual?.toFixed(2)}%</span></p>
                                    <div className="bg-yellow-600 p-2 rounded-lg mt-2 text-center font-bold text-white">
                                        Total inversión: <span>${accion.ganancia_perdida}</span>
                                    </div>
                                   
                                    <PriceHistoryChartCompras historialPrecios={ultimos5Precios} />
                                    
                                    <div className="bg-yellow-600 p-2 rounded-lg mt-2 text-center font-bold text-white">
                                        <button onClick={() => handleSellClick(accion)} className="bg-transparent hover:bg-yellow-500 transition-colors duration-300 p-2 rounded">
                                            Vender
                                        </button>
                                    </div>
                                    
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full">
                            <p>No tienes acciones.</p>
                        </div>
                    )}
                </div>
            </div>
    
            <div>
                <h2 className="text-3xl font-semibold text-white mb-4">Bonos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bonos.length > 0 ? (
                        bonos.map((bono) => {
                            const historialPrecios = bono.historialPreciosCompra || [];
                            const ultimos5Precios = historialPrecios.slice(-5); 
                            console.log(ultimos5Precios);
                            const activo = activos.get(bono.activo_id); // Obtener el activo relacionado
                            return (
                                <div key={bono.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                                    <h3 className="text-lg font-semibold text-blue-200">{activo?.nombre}</h3>
                                    <p>Nombre: <span className="text-blue-300">{activo?.nombre || 'Cargando...'}</span></p>
                                    <div className="flex justify-between">
                    <p>Cantidad: <span className="text-blue-300">{bono.cantidad}</span></p> {/* Assuming 'cantidad' is a property */}
                    <p className="font-semibold">Estado:
                        <span className={`capitalize ${bono.estado === 'vencido' ? 'text-red-500' : 'text-green-500'}`}>{bono.estado}</span>
                    </p>
                </div>
                                    <p>Precio de compra: <span className="text-blue-300">${bono.precio_compra}</span></p>
                                    <p>Fecha de compra: <span className="text-blue-300">{new Date(bono.fecha_compra || '').toLocaleString()}</span></p>
                                    <p>Fecha de vencimiento: <span className="text-blue-300">{bono.fecha_vencimiento ? new Date(bono.fecha_vencimiento).toLocaleString() : '-'}</span></p>
                                    <p>Precio actual: <span className="text-blue-300">${bono.precio_actual}</span></p>
                                    <p>Rendimiento: <span className={`font-bold ${bono.rendimientoPorcentual! >= 0 ? 'text-green-500' : 'text-red-500'}`}>{bono.rendimientoPorcentual?.toFixed(2)}%</span></p>
                                    <div className="bg-yellow-600 p-2 rounded-lg mt-2 text-center font-bold text-white">
                                        Total inversión: <span>${bono.ganancia_perdida}</span>
                                    </div>
                                    <PriceHistoryChartCompras historialPrecios={ultimos5Precios} />
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full">
                            <p>No tienes bonos.</p>
                        </div>
                    )}
                </div>
            </div>
            {showModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
        <div className="bg-gray-800 rounded-lg p-5 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Confirmar Venta</h2>
            <p className="text-gray-300">
                ¿Estás seguro de que deseas vender el activo <strong className="text-blue-300">{selectedActivo?.activo_id}</strong>?
            </p>
            <div className="mt-4 flex justify-between">
                <button 
                    onClick={() => setShowModal(false)} 
                    className="bg-gray-600 text-white rounded py-2 px-4 hover:bg-gray-500"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleConfirmSell} 
                    className="bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-500"
                >
                    Confirmar Venta
                </button>
            </div>
        </div>
    </div>
)}
<LoadingModal isOpen={isLoadingModalOpen} />
<div className='mt-8'>
        {/* Tu código existente */}
        <HistorialInversiones />
    </div>

        </div>
    );
};

export default DashboardInversiones;
