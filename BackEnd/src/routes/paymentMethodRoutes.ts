// src/routes/paymentMethodRoutes.ts
import { Router } from 'express';
import { 
    obtenerTodosLosMetodosPago, 
    crearTransferenciaBanco, 
    crearTarjetaCredito, 
    crearBilleteraDigital, 
    obtenerTransferenciaBanco,
    obtenerTarjetaCredito,
    obtenerBilleteraDigital,
    borrarTransferenciaBanco,
    borrarTarjetaCredito,
    borrarBilleteraDigital
} from '../controllers/paymentMethodController';

const router = Router();

// Ruta para obtener todos los métodos de pago
router.get('/', obtenerTodosLosMetodosPago);

// Ruta para crear y obtener una nueva transferencia bancaria por user_id
router.post('/transferencia', crearTransferenciaBanco);
router.get('/transferencia/:user_id', obtenerTransferenciaBanco);
// Ruta para eliminar una transferencia bancaria por ID
router.delete('/transferencia/:id', borrarTransferenciaBanco);

// Ruta para crear y obtener una nueva tarjeta de crédito/débito por user_id
router.post('/tarjeta', crearTarjetaCredito);
router.get('/tarjeta/:user_id', obtenerTarjetaCredito);
// Ruta para eliminar una tarjeta de crédito por ID
router.delete('/tarjeta/:id', borrarTarjetaCredito);

// Ruta para crear y obtener una nueva billetera digital por user_id
router.post('/billetera', crearBilleteraDigital);
router.get('/billetera/:user_id', obtenerBilleteraDigital);
// Ruta para eliminar una billetera digital por ID
router.delete('/billetera/:id', borrarBilleteraDigital);

export default router;
