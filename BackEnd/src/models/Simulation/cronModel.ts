import cron from 'node-cron';
import pool from '../../config'; // Asegúrate de que el pool esté configurado para PostgreSQL
import { HistorialActivo } from './historyAssetsModel';
import { Server } from 'socket.io';


// Función para procesar bonos vencidos cada minuto
const procesarBonosVencidos = (io:Server) => async () => {
    console.log("Verificando bonos...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Seleccionar bonos vencidos
        const bonosVencidosQuery = `
            SELECT id, usuario_id, activo_id, cantidad, precio_compra, precio_actual, ganancia_perdida, tipo_activo
            FROM compras_activos
            WHERE tipo_activo = 'bono'
              AND estado = 'comprado'
              AND fecha_vencimiento <= NOW();
        `;
        const bonosVencidosResult = await client.query(bonosVencidosQuery);
        const bonosVencidos = bonosVencidosResult.rows;

        for (const bono of bonosVencidos) {
            const { id, usuario_id, activo_id, cantidad, precio_compra, precio_actual, ganancia_perdida } = bono;

            // Actualizar el saldo del usuario
            const actualizarSaldoQuery = `
                UPDATE usuarios
                SET saldo = saldo + $1
                WHERE id = $2;
            `;
            await client.query(actualizarSaldoQuery, [ganancia_perdida, usuario_id]);

            // Insertar en el historial de inversiones
            const historial: HistorialActivo = {
                id: 0, // Este campo se generará automáticamente en la base de datos
                usuario_id,
                activo_id,
                cantidad,
                precio_venta: precio_compra,
                fecha_venta: new Date(), // Fecha de la venta actual
                ganancia: ganancia_perdida,
                estado: 'vendido',
                tipo_activo: 'bono'
            };
            const insertarHistorialQuery = `
                INSERT INTO historial_inversiones (usuario_id, activo_id, cantidad, precio_venta, fecha_venta, ganancia, estado, tipo_activo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;
            await client.query(insertarHistorialQuery, [
                historial.usuario_id,
                historial.activo_id,
                historial.cantidad,
                historial.precio_venta,
                historial.fecha_venta,
                historial.ganancia,
                historial.estado,
                historial.tipo_activo,
            ]);

            // Eliminar el registro de la tabla compras_activos
            const eliminarCompraActivoQuery = `
                DELETE FROM compras_activos
                WHERE id = $1;
            `;
            await client.query(eliminarCompraActivoQuery, [id]);
        }

        await client.query('COMMIT'); // Confirmar la transacción
        console.log(`Procesados ${bonosVencidos.length} bonos vencidos.`);

        // Emitir los cambios de bonos a todos los clientes conectados
        io.emit('bonosActualizados', bonosVencidos);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        console.error('Error al procesar bonos vencidos:', error);
    } finally {
        client.release(); // Liberar el cliente
    }
};

// Configurar el cron job para que se ejecute cada minuto
const iniciarProcesamientoBonosVencidos = (io: Server) => {
    cron.schedule('* * * * *', procesarBonosVencidos(io));
};


export default iniciarProcesamientoBonosVencidos;
