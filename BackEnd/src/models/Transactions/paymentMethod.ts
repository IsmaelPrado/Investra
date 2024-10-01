// src/models/paymentMethods.ts
import pool from '../../config';

export interface MetodoPago {
    id?: number;
    nombre_metodo: string;
}

// Función para obtener todos los métodos de pago
export const obtenerTodosLosMetodosPago = async (): Promise<MetodoPago[] | null> => {
    const result = await pool.query('SELECT * FROM metodo_pagos;');
    if (result.rows.length > 0) {
        return result.rows;
    }
    return null;
};