// src/api.ts
import axios from 'axios';

// URL base de tu API
const API_URL = 'http://localhost:3000/api'; // Asegúrate de que la URL sea correcta

// Tipos de datos para activos e inversiones
export interface Asset {
    id: number;
    nombre: string;
    tipo: 'accion' | 'bono_gubernamental' | 'bono_organizacional';
    precio: number;
    min_variacion: number;
    max_variacion: number;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    historialPrecios: PriceHistory[]; // Asegúrate de incluir esto
    rendimientoAbsoluto?: number; // Nueva propiedad
    cambioPorcentual?: number; // Nueva propiedad
}

export interface Investment {
    id?: number;
    usuario_id: number;
    activo_id: number;
    cantidad: number;
    precio_compra: number;
}

export interface PriceHistory {
    precio: number;
    timestamp: string;
}
// Obtener todos los activos
export const obtenerActivos = async (): Promise<Asset[]> => {
    const response = await axios.get(`${API_URL}/activos`);
    return response.data;
};

// Crear un nuevo activo
export const crearActivo = async (activo: Asset): Promise<Asset> => {
    const response = await axios.post(`${API_URL}/activos`, activo);
    return response.data;
};

// Comprar un activo
export const comprarActivo = async (usuarioId: number, activoId: number, cantidad: number): Promise<Investment> => {
    const response = await axios.post(`${API_URL}/inversiones/comprar`, {
        usuario_id: usuarioId,
        activo_id: activoId,
        cantidad,
    });
    return response.data;
};

// Obtener inversiones de un usuario
export const obtenerInversionesPorUsuario = async (usuarioId: number): Promise<Investment[]> => {
    const response = await axios.get(`${API_URL}/inversiones/${usuarioId}/inversiones/`);
    return response.data;
};


// NUEVO MÉTODO PARA OBTENER DATOS INICIALES DE LOS ACTIVOS
export const obtenerActivosIniciales = async (): Promise<Asset[]> => {
    const response = await axios.get(`${API_URL}/simulacion/activos`); // Asegúrate de que la ruta sea correcta
    return response.data;
};