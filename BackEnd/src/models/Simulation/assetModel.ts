// src/models/assetModel.ts
import pool from '../../config';
import { PriceHistory } from './priceHistoryModel';

export interface Asset {
    id?: number;
    nombre: string;
    tipo: 'accion' | 'bono_gubernamental' | 'bono_organizacional';
    precio: number;
    min_variacion: number;
    max_variacion: number;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
    historialPrecios?: PriceHistory[];
    rendimientoAbsoluto?: string; // Nueva propiedad
    cambioPorcentual?: string; // Nueva propiedad
}


// Función para obtener todos los activos
export const obtenerTodosLosActivos = async (): Promise<Asset[]> => {
    const result = await pool.query('SELECT * FROM activos');
    return result.rows;
};

// Función para actualizar el precio de un activo
export const actualizarPrecioActivo = async (id: number, nuevoPrecio: number): Promise<void> => {
    await pool.query(
        `UPDATE activos SET precio = $1, fecha_actualizacion = NOW() WHERE id = $2`,
        [nuevoPrecio, id]
    );
};

// Función para crear un nuevo activo
export const crearActivo = async (activo: Asset): Promise<Asset> => {
    const { nombre, tipo, precio, min_variacion, max_variacion } = activo;
    const result = await pool.query(
        `INSERT INTO activos (nombre, tipo, precio, min_variacion, max_variacion)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombre, tipo, precio, min_variacion, max_variacion]
    );
    return result.rows[0];
};

// Función para obtener un activo por su ID
export const obtenerActivoPorId = async (activoId: number): Promise<Asset> => {
    const id = activoId;
    const result = await pool.query(  `SELECT * FROM activos WHERE id = $1`,
   [id]);
   return result.rows[0];
};

// Función para obtener activos según el riesgo
export const obtenerActivosPorRiesgo = async (riesgo: string): Promise<Asset[]> => {
    let tipoActivo: string;

    // Determinar el tipo de activo según el riesgo
    switch (riesgo) {
        case 'B': // Bajo
            tipoActivo = 'bono_gubernamental';
            break;
        case 'M': // Moderado
            tipoActivo = 'bono_organizacional';
            break;
        case 'A': // Alto
            tipoActivo = 'accion';
            break;
        default:
            throw new Error('Riesgo no válido');
    }

    // Consulta para obtener los activos del tipo determinado
    const result = await pool.query('SELECT * FROM activos WHERE tipo = $1', [tipoActivo]);
    return result.rows;
};