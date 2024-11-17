import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSocket } from '../../context/SocketContext';

const CountdownTimer: React.FC = () => {
    const [secondsRemaining, setSecondsRemaining] = useState(30); // Valor inicial
    const socket = useSocket(); // Usa el hook para obtener el socket

    useEffect(() => {
        if (socket) {
               // Escucha el evento "countdown" del servidor
        socket.on("countdown", (countdown: number) => {
            setSecondsRemaining(countdown);
        });

        // Limpieza de la conexión al desmontar el componente
        return () => {
            socket.disconnect();
        };
        }
     
    }, []);

    return (
        <div>
            <p className="text-sm text-gray-400 mt-2">Actualización en: {secondsRemaining} segundos</p>
        </div>
    );
};

export default CountdownTimer;
