// src/services/verificationService.ts
import axios from 'axios';

interface VerificationResponse {
    mensaje: string;
    token?: string;
    usuario?: {
        id: number;
        nombre: string;
        correo: string;
        es_verificado: boolean;
    };
    fechaExpiracion?: string;
}

export const verificarCodigo = async (correo: string, codigo_verificacion: string): Promise<VerificationResponse> => {
    try {
        const response = await axios.post('http://localhost:3000/usuarios/verificar', {
            correo,
            codigo_verificacion,
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.mensaje || 'Error en la verificación');
        } else {
            throw new Error('Error desconocido en la verificación');
        }
    }
};
