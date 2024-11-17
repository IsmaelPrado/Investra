import pool from '../../config';// Asegúrate de tener pg instalado


export interface HistorialActivo {
    id: number;                // ID del registro en el historial
    usuario_id: number;       // ID del usuario que realizó la inversión
    activo_id: number;        // ID del activo (acción o bono) relacionado
    cantidad: number;         // Cantidad de activos vendidos
    precio_venta: number;     // Precio al que se vendió el activo
    fecha_venta: Date;        // Fecha de la venta
    ganancia: number | null;   // Ganancia obtenida de la venta (puede ser null si no se proporciona)
    estado: string;           // Estado de la inversión (por ejemplo, "vendido", "en espera", etc.)
    tipo_activo: string;      // Tipo de activo (por ejemplo, "acción" o "bono")
}


export const crearHistorialInversion = async (historial: HistorialActivo, compraActivoId: number): Promise<HistorialActivo> => {
    const client = await pool.connect(); // Conectar al pool
    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Consulta para insertar en el historial de inversiones
        const query = `
            INSERT INTO historial_inversiones (usuario_id, activo_id, cantidad, precio_venta, fecha_venta, ganancia, estado, tipo_activo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            historial.usuario_id,
            historial.activo_id,
            historial.cantidad,
            historial.precio_venta,
            historial.fecha_venta,
            historial.ganancia,
            historial.estado,
            historial.tipo_activo,
        ];

        const result = await client.query(query, values);
        const nuevoHistorial = result.rows[0]; // Retorna el nuevo registro insertado

        // Consulta para actualizar el saldo del usuario
        const saldoActualizadoQuery = `
            UPDATE usuarios
            SET saldo = saldo + $1
            WHERE id = $2;
        `;
        const saldoActualizadoValues = [
            nuevoHistorial.ganancia, // Usar ganancia
            historial.usuario_id,
        ];

        await client.query(saldoActualizadoQuery, saldoActualizadoValues); // Actualiza el saldo

        // Consulta para eliminar el registro en compras_activos
        const deleteCompraActivoQuery = `
            DELETE FROM compras_activos
            WHERE id = $1;
        `;
        await client.query(deleteCompraActivoQuery, [compraActivoId]); // Eliminar registro de compras_activos

        await client.query('COMMIT'); // Confirmar transacción
        return nuevoHistorial; // Retorna el nuevo registro insertado
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        console.error('Error al crear el historial de inversión:', error);
        throw new Error(`No se pudo crear el historial de inversión: ${error}`); // Lanza un error descriptivo
    } finally {
        client.release(); // Liberar el cliente
    }
};



// Función para obtener el historial de inversiones por usuario
export const obtenerHistorialPorUsuario = async (usuarioId: number): Promise<HistorialActivo[]> => {
    const query = `
        SELECT * FROM historial_inversiones
        WHERE usuario_id = $1
        ORDER BY fecha_venta DESC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows; // Retorna un array con el historial de inversiones del usuario
};
