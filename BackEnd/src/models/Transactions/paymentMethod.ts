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
}

// Función para insertar una nueva transferencia bancaria
export const insertarTransferenciaBanco = async (transferencia: TransferenciaBanco): Promise<void> => {
    const {nombre_banco, numero_cuenta, clabe_o_iban } = transferencia;
    await pool.query(
        `INSERT INTO transferencia_banco 
        ( nombre_banco, numero_cuenta, clabe_o_iban) 
        VALUES ($1, $2, $3);`,
        [ nombre_banco, numero_cuenta, clabe_o_iban]
    );
};

// Interfaz para TarjetaCredito
export interface TarjetaCredito {
    id?: number;
    numero_tarjeta: string;
    fecha_vencimiento: string;
    cvv: string;
    nombre_titular: string;
}

// Función para insertar una nueva tarjeta de crédito/débito
export const insertarTarjetaCredito = async (tarjeta: TarjetaCredito): Promise<void> => {
    const { numero_tarjeta, fecha_vencimiento, cvv, nombre_titular } = tarjeta;
    await pool.query(
        `INSERT INTO tarjeta_credito 
        ( numero_tarjeta, fecha_vencimiento, cvv, nombre_titular) 
        VALUES ($1, $2, $3, $4);`,
        [ numero_tarjeta, fecha_vencimiento, cvv, nombre_titular]
    );
};


// Interfaz para BilleteraDigital
export interface BilleteraDigital {
    id?: number;
    direccion_billetera: string;
}

// Función para insertar una nueva billetera digital
export const insertarBilleteraDigital = async (billetera: BilleteraDigital): Promise<void> => {
    const { direccion_billetera } = billetera;
    await pool.query(
        `INSERT INTO billetera_digital 
        ( direccion_billetera) 
        VALUES ($1);`,
        [ direccion_billetera]
    );
};