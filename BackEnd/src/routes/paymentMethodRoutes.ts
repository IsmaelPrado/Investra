// src/routes/paymentMethodRoutes.ts
import { Router } from 'express';
import { 
    obtenerTodosLosMetodosPago, 
    crearTransferenciaBanco, 
    crearTarjetaCredito, 
    crearBilleteraDigital, 
    obtenerTransferenciaBanco,
    obtenerTarjetaCredito,
    obtenerBilleteraDigital
} from '../controllers/paymentMethodController';

const router = Router();

// Ruta para obtener todos los métodos de pago
router.get('/', obtenerTodosLosMetodosPago);

// Ruta para crear y obtener una nueva transferencia bancaria por user_id
router.post('/transferencia', crearTransferenciaBanco);
router.get('/transferencia/:user_id', obtenerTransferenciaBanco);

// Ruta para crear y obtener una nueva tarjeta de crédito/débito por user_id
router.post('/tarjeta', crearTarjetaCredito);
router.get('/tarjeta/:user_id', obtenerTarjetaCredito);

// Ruta para crear y obtener una nueva billetera digital por user_id
router.post('/billetera', crearBilleteraDigital);
router.get('/billetera/:user_id', obtenerBilleteraDigital);

export default router;
