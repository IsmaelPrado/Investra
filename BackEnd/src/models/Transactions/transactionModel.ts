// src/models/transactionModel.ts
import pool from '../../config';

export interface Transaccion {
    id?: number;
    usuarioId: number; // ID del usuario que realiza la transacción
    metodoPagoId: 1 | 2 | 3; // Método de pago -> 1 (Transferencia bancaria), 2 (Tarjeta crédito/débito), 3 (Billetera digital)
    cantidad: number; // Monto de la transacción
    proposito?: string;
    codigo_autenticacion?: string;
    fecha?: Date; // Fecha de la transacción
    estado?: 'Realizada'; // Default 'Pendiente'
}

// Función para crear una nueva transacción en la base de datos y actualizar el sueldo del usuario
export const crearTransaccion = async (transaccion: Transaccion): Promise<Transaccion> => {
    const { usuarioId, cantidad, metodoPagoId, proposito } = transaccion;

    // Iniciar una transacción en la base de datos
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Insertar la nueva transacción
        const result = await client.query(
            `INSERT INTO transacciones (usuario_id, cantidad, metodo_pago_id, proposito, codigo_autenticacion, fecha_creacion, estado)
             VALUES ($1, $2, $3, $4, '12345', NOW(), 'Realizada') RETURNING *`,
            [usuarioId, cantidad, metodoPagoId, proposito]
        );

        const nuevaTransaccion = result.rows[0];

        // Actualizar el sueldo del usuario sumando la cantidad de la transacción
        await client.query(
            `UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2`,
            [cantidad, usuarioId]
        );

        // Confirmar la transacción
        await client.query('COMMIT');

        return nuevaTransaccion;
    } catch (error) {
        // En caso de error, revertir la transacción
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Liberar el cliente de la base de datos
        client.release();
    }
};

// Función para retirar fondos y actualizar el saldo del usuario
export const retirarFondos = async (transaccion: Transaccion): Promise<Transaccion> => {
    const { usuarioId, cantidad, metodoPagoId, proposito } = transaccion;

    // Iniciar una transacción en la base de datos
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Obtener el saldo actual del usuario
        const usuarioResult = await client.query(
            `SELECT saldo FROM usuarios WHERE id = $1`,
            [usuarioId]
        );
        const saldoActual = usuarioResult.rows[0].saldo;

        // Verificar que el usuario tenga suficiente saldo
        if (saldoActual < cantidad) {
            throw new Error('Fondos insuficientes para realizar el retiro');
        }

        // Insertar la nueva transacción
        const result = await client.query(
            `INSERT INTO transacciones (usuario_id, cantidad, metodo_pago_id, proposito, codigo_autenticacion, fecha_creacion, estado)
             VALUES ($1, $2, $3, $4, '54321', NOW(), 'Realizada') RETURNING *`,
            [usuarioId, cantidad, metodoPagoId, proposito] // Nota que la cantidad es negativa para representar el retiro
        );

        const nuevaTransaccion = result.rows[0];

        // Actualizar el saldo del usuario restando la cantidad retirada
        await client.query(
            `UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2`,
            [cantidad, usuarioId]
        );

        // Confirmar la transacción
        await client.query('COMMIT');

        return nuevaTransaccion;
    } catch (error) {
        // En caso de error, revertir la transacción
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Liberar el cliente de la base de datos
        client.release();
    }
};


// Función para obtener transacciones de un usuario
export const obtenerTransaccionesPorUsuario = async (usuarioId: number): Promise<Transaccion[]> => {
    const result = await pool.query('SELECT * FROM transacciones WHERE usuario_id = $1', [usuarioId]);
    return result.rows; // Devuelve la lista de transacciones
};

// Función para obtener todas las transacciones
export const obtenerTodasLasTransacciones = async (): Promise<Transaccion[]> => {
    const result = await pool.query('SELECT * FROM transacciones');
    return result.rows; // Devuelve la lista de todas las transacciones
};

// Función para obtener una transacción por su ID
export const obtenerTransaccionPorId = async (id: number): Promise<Transaccion | null> => {
    const result = await pool.query('SELECT * FROM transacciones WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Función para eliminar una transacción por su ID
export const eliminarTransaccion = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM transacciones WHERE id = $1', [id]);
};
