import pool from '../../config';
import { Asset } from './assetModel';
import { HistorialCompras } from './priceHistoryModel';

export interface CompraActivo {
    id?: number;
    usuario_id: number;
    activo_id: number;
    cantidad?: number; // Solo para acciones
    precio_compra: number;
    fecha_compra?: Date;
    fecha_vencimiento?: Date | null; // Solo para bonos
    estado: 'comprado' | 'vendido' | 'vencido';
    fecha_venta?: Date | null;
    tipo_activo: 'accion' | 'bono'; // Nuevo campo agregado
    precio_actual: number;
    ganancia_perdida: number;
    rendimientoPorcentual?: number;
    cambioPrecio30Segundos?: number;
    totalInversion?: number;
    historialPreciosCompra?: HistorialCompras[];
}

// Función para crear una nueva compra de activo (acciones)
export const crearCompraAccion = async (compra: CompraActivo): Promise<CompraActivo> => {
    const { usuario_id, activo_id, cantidad, precio_compra, estado, tipo_activo, precio_actual, ganancia_perdida } = compra;

    if (!cantidad) {
        throw new Error('La cantidad es obligatoria para la compra de acciones.');
    }

    // Inicia la transacción
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Inicia la transacción

        // Inserta la compra
        const result = await client.query(
            `INSERT INTO compras_activos 
                (usuario_id, activo_id, cantidad, precio_compra, fecha_compra, estado, tipo_activo, precio_actual, ganancia_perdida)
             VALUES 
                ($1, $2, $3, $4, NOW(), $5, $6, $7 ,$8)
             RETURNING *`,
            [usuario_id, activo_id, cantidad, precio_compra, estado, tipo_activo, precio_actual, ganancia_perdida]
        );

        // Obtén el monto a deducir del saldo
        const montoTotal = precio_compra; // Asumiendo que precio_compra es el total a descontar

        // Actualiza el saldo del usuario
        await client.query(
            `UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2`,
            [montoTotal, usuario_id]
        );

        await client.query('COMMIT'); // Confirma la transacción
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        throw new Error('Error al realizar la compra: ' + error);
    } finally {
        client.release(); // Libera el cliente
    }
};
export const crearCompraBono = async (compra: CompraActivo): Promise<CompraActivo> => {
    const { usuario_id, activo_id, cantidad, precio_compra, fecha_vencimiento, estado, tipo_activo } = compra;

    const client = await pool.connect();

    if (!fecha_vencimiento) {
        throw new Error("La fecha de vencimiento es requerida");
    }

    const result = await pool.query(
        `INSERT INTO compras_activos 
            (usuario_id, activo_id, precio_compra, fecha_compra, fecha_vencimiento, estado, tipo_activo, cantidad)
         VALUES 
            ($1, $2, $3, NOW(), $4, $5, $6, $7)
         RETURNING *`,
        [usuario_id, activo_id, precio_compra, fecha_vencimiento, estado, tipo_activo, cantidad]
    );

    // Deducción del saldo del usuario
    const montoTotal = precio_compra;
    await client.query(
        `UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2`,
        [montoTotal, usuario_id]
    );

    return result.rows[0];
};

// Función para obtener una compra por su ID
export const obtenerCompraPorId = async (compraId: number): Promise<CompraActivo | null> => {
    const result = await pool.query('SELECT * FROM compras_activos WHERE id = $1', [compraId]);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Función para actualizar el estado de una compra
export const actualizarEstadoCompra = async (compraId: number, estado: 'vendido' | 'vencido', fecha_venta?: Date): Promise<void> => {
    await pool.query(
        `UPDATE compras_activos 
         SET estado = $1, fecha_venta = $2
         WHERE id = $3`,
        [estado, fecha_venta, compraId]
    );
};

// Función para obtener todas las compras de un usuario
export const obtenerComprasPorUsuario = async (usuarioId: number): Promise<CompraActivo[]> => {
    const result = await pool.query('SELECT * FROM compras_activos WHERE usuario_id = $1', [usuarioId]);
    return result.rows;
};


// Función para obtener todas las inversiones (compras activas) de un activo específico
export const obtenerInversionesPorActivo = async (activoId: number): Promise<CompraActivo[]> => {
    try {
        const result = await pool.query(
            `SELECT * FROM compras_activos WHERE activo_id = $1 AND estado = 'comprado'`,
            [activoId]
        );
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener las inversiones por activo: ' + error);
    }
};

// Función para actualizar la inversión de un usuario, incluyendo la ganancia/pérdida
export const actualizarInversionUsuario = async (
    compraId: number,
    nuevoPrecio: number,
    gananciaPerdida: number
): Promise<void> => {
    try {
        // Actualizar la compra con el nuevo precio del activo y calcular la ganancia/pérdida
        await pool.query(
            `UPDATE compras_activos 
             SET precio_actual = $1, ganancia_perdida = $2
             WHERE id = $3`,
            [nuevoPrecio, gananciaPerdida, compraId]
        );
    } catch (error) {
        throw new Error('Error al actualizar la inversión del usuario: ' + error);
    }
};