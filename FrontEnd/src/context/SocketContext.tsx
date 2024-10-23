import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
    children: ReactNode; // Define el tipo para children
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io('http://localhost:3000');
    
        socketInstance.on('connect', () => {
            console.log('Conectado al servidor');
        });
    
        socketInstance.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });
    
        socketInstance.on('disconnect', (reason) => {
            console.log('Desconectado:', reason);
        });
    
        socketInstance.on('error', (error) => {
            console.error('Error en el socket:', error);
        });
    
        setSocket(socketInstance);
    
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    
    

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
