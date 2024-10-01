// src/routes/paymentMethodRoutes.ts
import { Router } from 'express';
import { obtenerTodosLosMetodosPago } from '../controllers/paymentMethodController'; // Asegúrate de importar el controlador correcto

const router = Router();

// Ruta para obtener todos los métodos de pago
router.get('/', obtenerTodosLosMetodosPago);

export default router;
