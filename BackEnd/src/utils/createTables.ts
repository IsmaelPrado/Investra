// src/utils/createTables.ts
import pool from '../config';

export const crearTablas = async (): Promise<void> => {
    try {
        // Tabla de Activos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS activos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) UNIQUE NOT NULL,
                tipo VARCHAR(10) CHECK (tipo IN ('bond', 'stock')) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                min_variacion DECIMAL(5, 2) NOT NULL,
                max_variacion DECIMAL(5, 2) NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT NOW(),
                fecha_actualizacion TIMESTAMP DEFAULT NOW()
            );
        `);

        // Tabla de Usuarios (si no está creada ya)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE NOT NULL,
                contraseña VARCHAR(255) NOT NULL,
                codigo_verificacion VARCHAR(6),
                metodo_autenticacion VARCHAR(50),
                es_verificado BOOLEAN DEFAULT FALSE,
                token_refresco VARCHAR(255),
                fecha_expiracion TIMESTAMP,
                fecha_creacion TIMESTAMP DEFAULT NOW(),
                fecha_actualizacion TIMESTAMP DEFAULT NOW(),
                saldo DECIMAL(15, 2) DEFAULT 0
            );
        `);


        // Tabla de Historial de Precios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS historial_precios (
                id SERIAL PRIMARY KEY,
                activo_id INTEGER REFERENCES activos(id) ON DELETE CASCADE,
                precio DECIMAL(10, 2) NOT NULL,
                timestamp TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('Tablas creadas o ya existentes.');
    } catch (error) {
        console.error('Error al crear tablas:', error);
    }
};
