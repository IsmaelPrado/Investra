// src/models/priceHistoryModel.ts
import pool from '../../config';

export interface PriceHistory {
    id?: number;
    activo_id: number;
    precio: number;
    timestamp?:  Date; // Mantener como objeto Date
}

export interface HistorialCompras {
    id?: number;
    usuario_id: number;
    activo_id: number;
    precio_inicial: number;
    precio_final?: number;
    cantidad: number;
    fecha_compra?: Date; // Mantener como objeto Date
    fecha_final?: Date;   // Mantener como objeto Date, opcional
    estado: string;
    tipo_activo: string;
}


// Función para crear una entrada en el historial de precios
export const crearHistorialPrecio = async (historial: PriceHistory): Promise<PriceHistory> => {
    const { activo_id, precio } = historial;
    const result = await pool.query(
        `INSERT INTO historial_precios (activo_id, precio)
         VALUES ($1, $2) RETURNING *`,
        [activo_id, precio]
    );
    return result.rows[0];
};

export const crearHistorialCompra = async (historial: HistorialCompras): Promise<HistorialCompras> => {
    const { usuario_id, activo_id, precio_inicial, precio_final, cantidad, fecha_compra, fecha_final, estado, tipo_activo } = historial;
    const result = await pool.query(
        `INSERT INTO historial_compras (usuario_id, activo_id, precio_inicial, precio_final, cantidad, fecha_compra, fecha_final, estado, tipo_activo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [usuario_id, activo_id, precio_inicial, precio_final, cantidad, fecha_compra || new Date(), fecha_final, estado, tipo_activo]
    );
    return result.rows[0];
};


// Función para obtener el historial de precios de un activo
export const obtenerHistorialPreciosPorActivo = async (activo_id: number): Promise<PriceHistory[]> => {
    const result = await pool.query(
        `SELECT * FROM historial_precios WHERE activo_id = $1 ORDER BY timestamp ASC`,
        [activo_id]
    );
    return result.rows;
};

// Función para obtener el historial de compras de un activo
export const obtenerHistorialCompraPorActivoComprado = async (activo_id: number): Promise<HistorialCompras[]> => {
    const result = await pool.query(
        `SELECT * FROM historial_compras WHERE activo_id = $1 ORDER BY fecha_compra ASC`,
        [activo_id]
    );
    return result.rows;
};

