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

// Interfaz para TransferenciaBanco
export interface TransferenciaBanco {
    id?: number;
    nombre_banco: string;
    numero_cuenta: string;
    clabe_o_iban: string;
    user_id: number; // Añadir user_id
}

// Función para insertar una nueva transferencia bancaria
export const insertarTransferenciaBanco = async (transferencia: TransferenciaBanco): Promise<void> => {
    const { nombre_banco, numero_cuenta, clabe_o_iban, user_id } = transferencia;
    await pool.query(
        `INSERT INTO transferencia_banco 
        (nombre_banco, numero_cuenta, clabe_o_iban, user_id) 
        VALUES ($1, $2, $3, $4);`,
        [nombre_banco, numero_cuenta, clabe_o_iban, user_id]
    );
};

// Función para obtener la información de transferencia bancaria por user_id
export const obtenerTransferenciaBancoPorUsuario = async (userId: number): Promise<TransferenciaBanco[] | null> => {
    const result = await pool.query(
        `SELECT id, nombre_banco, numero_cuenta, clabe_o_iban, user_id
         FROM transferencia_banco 
         WHERE user_id = $1;`,
        [userId]
    );

    if (result.rows.length > 0) {
        return result.rows;
    }
    return null;
};


// Interfaz para TarjetaCredito
export interface TarjetaCredito {
    id?: number;
    numero_tarjeta: string;
    fecha_vencimiento: string;
    cvv: string;
    nombre_titular: string;
    user_id: number; // Añadir user_id
}

// Función para insertar una nueva tarjeta de crédito/débito
export const insertarTarjetaCredito = async (tarjeta: TarjetaCredito): Promise<void> => {
    const { numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id } = tarjeta;
    await pool.query(
        `INSERT INTO tarjeta_credito 
        (numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id) 
        VALUES ($1, $2, $3, $4, $5);`,
        [numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id]
    );
};

// Función para obtener la información de tarjeta de crédito/débito por user_id
export const obtenerTarjetaCreditoPorUsuario = async (userId: number): Promise<TarjetaCredito[] | null> => {
    const result = await pool.query(
        `SELECT id, numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id
         FROM tarjeta_credito 
         WHERE user_id = $1;`,
        [userId]
    );

    if (result.rows.length > 0) {
        return result.rows;
    }
    return null;
};



// Interfaz para BilleteraDigital
export interface BilleteraDigital {
    id?: number;
    direccion_billetera: string;
    user_id: number; // Añadir user_id
}

// Función para contar el número de billeteras digitales de un usuario
export const contarBilleterasPorUsuario = async (user_id: string): Promise<number> => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM billetera_digital WHERE user_id = $1;`,
        [user_id]
    );
    return parseInt(result.rows[0].count, 10);
};

// Función para insertar una nueva billetera digital
export const insertarBilleteraDigital = async (billetera: BilleteraDigital): Promise<void> => {
    const { direccion_billetera, user_id } = billetera;
    await pool.query(
        `INSERT INTO billetera_digital 
        (direccion_billetera, user_id) 
        VALUES ($1, $2);`,
        [direccion_billetera, user_id]
    );
};


// Función para obtener la información de billetera digital por user_id
export const obtenerBilleteraDigitalPorUsuario = async (userId: number): Promise<BilleteraDigital[] | null> => {
    const result = await pool.query(
        `SELECT id, direccion_billetera, user_id
         FROM billetera_digital 
         WHERE user_id = $1;`,
        [userId]
    );

    if (result.rows.length > 0) {
        return result.rows;
    }
    return null;
};

