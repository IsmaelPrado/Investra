import axios from 'axios';

export interface PaymentMethod {
    id: number;
    nombre_metodo: string;
}

const API_URL = 'http://localhost:3000'; // Asegúrate de que la URL apunte a tu backend

// Función para obtener todos los métodos de pago
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await axios.get<PaymentMethod[]>(`${API_URL}/paymethod`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los métodos de pago:', error);
        throw error;
    }
};

// Servicio para crear una nueva transferencia bancaria
export const crearTransferenciaBanco = async (transferenciaData: any) => {
    try {
        const response = await axios.post(`${API_URL}/paymethod/transferencia`, transferenciaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear transferencia bancaria:', error);
        throw error;
    }
};

// Servicio para obtener la transferencia bancaria por user_id
export const getTransferenciaBancoPorUsuario = async (userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/paymethod/transferencia/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la transferencia bancaria para el usuario ${userId}:`, error);
        throw error;
    }
};
// Servicio para eliminar una transferencia bancaria por ID
export const eliminarTransferenciaBanco = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/paymethod/transferencia/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la transferencia bancaria con ID ${id}:`, error);
        throw error;
    }
};

// Servicio para crear una nueva tarjeta de crédito/débito
export const crearTarjetaCredito = async (tarjetaData: any) => {
    try {
        const response = await axios.post(`${API_URL}/paymethod/tarjeta`, tarjetaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear tarjeta de crédito/débito:', error);
        throw error;
    }
};


// Servicio para obtener la tarjeta de crédito/débito por user_id
export const getTarjetaCreditoPorUsuario = async (userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/paymethod/tarjeta/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la tarjeta de crédito para el usuario ${userId}:`, error);
        throw error;
    }
};

// Servicio para eliminar una tarjeta de crédito por ID
export const eliminarTarjetaCredito = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/paymethod/tarjeta/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la tarjeta de crédito con ID ${id}:`, error);
        throw error;
    }
};

// Servicio para crear una nueva billetera digital
export const crearBilleteraDigital = async (billeteraData: any) => {
    try {
        const response = await axios.post(`${API_URL}/paymethod/billetera`, billeteraData);
        return response.data;
    } catch (error) {
        console.error('Error al crear billetera digital:', error);
        throw error;
    }
};

// Servicio para obtener la billetera digital por user_id
export const getBilleteraDigitalPorUsuario = async (userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/paymethod/billetera/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la billetera digital para el usuario ${userId}:`, error);
        throw error;
    }
};

// Servicio para eliminar una billetera digital por ID
export const eliminarBilleteraDigital = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/paymethod/billetera/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la billetera digital con ID ${id}:`, error);
        throw error;
    }
};

