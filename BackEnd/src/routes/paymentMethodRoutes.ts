// src/routes/paymentMethodRoutes.ts
import { Router } from 'express';
import { 
    obtenerTodosLosMetodosPago, 
    crearTransferenciaBanco, 
    crearTarjetaCredito, 
    crearBilleteraDigital 
} from '../controllers/paymentMethodController';

const router = Router();

// Ruta para obtener todos los métodos de pago
router.get('/', obtenerTodosLosMetodosPago);

// Ruta para crear una nueva transferencia bancaria
router.post('/transferencia', crearTransferenciaBanco);

// Ruta para crear una nueva tarjeta de crédito/débito
router.post('/tarjeta', crearTarjetaCredito);

// Ruta para crear una nueva billetera digital
router.post('/billetera', crearBilleteraDigital);

export default router;
