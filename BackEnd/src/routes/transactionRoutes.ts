// src/routes/transactionRoutes.ts
import { Router } from 'express';
import {
    crearNuevaTransaccion,
    obtenerTransacciones,
    obtenerTodasLasTransacciones,
    obtenerTransaccionPorId,
    eliminarTransaccion,
    retirarFondosUsuario,
} from '../controllers/transactionController';

const router = Router();

// Ruta para crear una nueva transacción
router.post('/', crearNuevaTransaccion);

// Ruta para retirar fondos de una cuenta
router.post('/retiro', retirarFondosUsuario)

// Ruta para obtener transacciones de un usuario
router.get('/usuario/:usuarioId', obtenerTransacciones);

// Ruta para obtener todas las transacciones
router.get('/', obtenerTodasLasTransacciones);

// Ruta para obtener una transacción por ID
router.get('/:id', obtenerTransaccionPorId);

// Ruta para eliminar una transacción
router.delete('/:id', eliminarTransaccion);

export default router;
