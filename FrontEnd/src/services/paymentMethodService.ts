import axios from 'axios';

export interface PaymentMethod {
    id: number;
    nombre_metodo: string;
}

const API_URL = 'http://localhost:3000/paymethod'; // Asegúrate de que la URL apunte a tu backend

// Función para obtener todos los métodos de pago
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
        const response = await axios.get<PaymentMethod[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los métodos de pago:', error);
        throw error;
    }
};
