import React, { useState, useEffect } from "react";
import TransactionModal from "../Transaction/TransactionModal";
import ActivosList from "../Simulation/AssetsList";
import { obtenerActivosIniciales } from "../../services/api";
import { format } from 'date-fns';
import { useSocket } from "../../context/SocketContext"; 
import { useUser } from "../../context/UserContext";
import ProfileInterview from "../Authentication/ProfileInterview";
import Recommendations from "./Recommendations";
import RetiroModal from "../Transaction/RetiroModal";

interface PriceData {
    id: number;
    price: number;
    timestamp: string;
}

interface InvestmentFormProps {
    userName: string; 
    userBalance: number; 
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ userName, userBalance }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
    const [isModalRetiroOpen, setIsModalRetiroOpen] = useState<boolean>(false); 
    const [assets, setAssets] = useState<any[]>([]); 
    const [showEncuesta, setShowEncuesta] = useState<boolean>(false);
    const [priceData, setPriceData] = useState<{ id: number; prices: number[]; timestamps: string[]; }[]>([]);

    const socket = useSocket(); 
    const { user } = useUser(); 
  
    useEffect(() => {
        const cargarActivos = async () => {
            try {
                const initialAssets = await obtenerActivosIniciales();
                setAssets(initialAssets);
            } catch (error) {
                console.error("Error al cargar los activos iniciales:", error);
            }
        };

        cargarActivos();

        if (!socket) return; 

        socket.on("updateAssets", (updatedAssets) => {
            const formattedAssets = updatedAssets.map((activo: any) => {
                const historialPreciosFormateado = activo.historialPrecios.map((precio: any) => {
                    const formattedTimestamp = format(new Date(precio.timestamp), 'yyyy-MM-dd HH:mm:ss');
                    return {
                        ...precio,
                        timestamp: formattedTimestamp, 
                    };
                });

                return {
                    ...activo,
                    historialPrecios: historialPreciosFormateado, 
                };
            });



            setAssets(formattedAssets);
        });

      

        socket.on("updatePrices", (newPriceData: PriceData[]) => {
            setPriceData(prevPriceData => {
                const updatedPriceData = [...prevPriceData];

                newPriceData.forEach((newData) => {
                    const existingDataIndex = updatedPriceData.findIndex(data => data.id === newData.id);
                    const formattedTimestamp = format(new Date(newData.timestamp), 'yyyy-MM-dd HH:mm:ss'); 

                    if (existingDataIndex > -1) {
                        if (!updatedPriceData[existingDataIndex].prices.includes(newData.price)) {
                            updatedPriceData[existingDataIndex].prices.push(newData.price);
                            updatedPriceData[existingDataIndex].timestamps.push(formattedTimestamp); 

                            if (updatedPriceData[existingDataIndex].prices.length > 20) {
                                updatedPriceData[existingDataIndex].prices.shift();
                                updatedPriceData[existingDataIndex].timestamps.shift();
                            }
                        }
                    } else {
                        updatedPriceData.push({
                            id: newData.id,
                            prices: [newData.price],
                            timestamps: [formattedTimestamp], 
                        });
                    }
                });

                return updatedPriceData; 
            });
        });

     

        return () => {
            socket.off("updateAssets"); 
            socket.off("updatePrices"); 
    
        };
    }, [socket]);

    return (
        <div className="main-content bg-gray-900 min-h-screen p-6">
            <div className="flex justify-between mb-6">
                {/* Sección izquierda (Nombre, saldo y botones para meter/retirar fondos) */}
                <div className="w-3/4 p-6 bg-gray-800 rounded-lg text-center shadow-lg mr-4">
                    <h1 className="text-4xl font-bold text-white">Hola, {userName}!</h1>
                    <p className="text-xl text-gray-300">Fondo disponible: ${userBalance.toFixed(2)}</p>
                    
                    <div className="flex justify-center space-x-4 mt-4">
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-500 transition duration-200 shadow-md"
                        >
                            Meter Fondos
                        </button>
                        <button 
                            onClick={()  => setIsModalRetiroOpen(true)} 
                            className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-500 transition duration-200 shadow-md"
                        >
                            Retirar Fondos
                        </button>
                    </div>

                    {!user?.estado_encuesta && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowEncuesta(true)}
                                className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition duration-200 shadow-md"
                            >
                                Buscar Recomendaciones
                            </button>
                        </div>
                    )}
                </div>

                {/* Sección derecha (Recomendaciones) */}
                <div className="w-2/4 p-6 bg-gray-800 rounded-lg shadow-lg">
                    {user?.estado_encuesta ? (
                        <Recommendations userId={user.id} activos={assets} />
                    ) : (
                        <p className="text-gray-400">Responde la encuesta para obtener recomendaciones personalizadas.</p>
                    )}
                </div>
            </div>

            {/* Sección completa para el mercado financiero */}
            {isModalOpen && <TransactionModal userBalance={userBalance} onClose={() => setIsModalOpen(false)} />}
            {/* Sección completa para el mercado financiero */}
            {isModalRetiroOpen && <RetiroModal userBalance={userBalance} onClose={() => setIsModalRetiroOpen(false)} />}
         
            {showEncuesta && (
               <div className="fixed inset-0 z-50 bg-black bg-opacity-75">
                   <ProfileInterview onClose={() => setShowEncuesta(false)} />
               </div>
            )}

            {/* ActivosList que ocupa el 100% del ancho */}
            <div className="w-full">
                <ActivosList activos={assets} priceData={priceData} />
            </div>
        </div>
    );
};

export default InvestmentForm;

