import axios from 'axios';

// Define la URL base para tus servicios
const BASE_URL = 'http://localhost:3000/historial';

// Interfaz para los datos del historial de inversión
export interface HistorialActivo {
    id?: number;
    usuario_id: number;
    activo_id: number;
    cantidad: number;
    precio_venta: number;
    fecha_venta: Date;
    ganancia: number | undefined;
    estado: string;
    tipo_activo: string;
}

// Función para crear un nuevo historial de inversión con compraActivoId
export const crearHistorialInversion = async (historial: HistorialActivo, compraActivoId: number): Promise<HistorialActivo> => {
    const response = await axios.post(`${BASE_URL}`, { historialData: historial, compraActivoId });
    return response.data; // Retorna el nuevo historial creado
};

// Función para obtener el historial de inversiones por usuario
export const obtenerHistorialPorUsuario = async (usuarioId: number | undefined): Promise<HistorialActivo[]> => {
    const response = await axios.get(`${BASE_URL}/usuario/${usuarioId}`);
    return response.data; // Retorna el historial del usuario
};
