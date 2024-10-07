// src/services/transactionService.ts

import axios from 'axios';

interface Transaccion {
    usuarioId: number;
    cantidad: number;
    metodoPagoId: number;
    proposito: string;
}

const API_URL = 'http://localhost:3000';

export const crearNuevaTransaccion = async (transaccion: Transaccion): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/transacciones`, transaccion);
        return response.data;
    } catch (error) {
        console.error('Error en el servicio de transacciones:', error);
        throw error;
    }
};
