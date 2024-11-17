// src/routes/simulationRoutes.ts
import { Router } from 'express';
import { obtenerActivosIniciales } from '../../controllers/Simulation/simulationController';

const router = Router();

// Ruta para verificar el estado de la simulación
router.get('/status', (req, res) => {
    res.json({ message: 'Simulación de inversión está corriendo.' });
});

// Puedes añadir más rutas según tus necesidades, como iniciar o detener la simulación manualmente.

// Nueva ruta para obtener los datos iniciales de los activos con historial de precios
router.get('/activos', obtenerActivosIniciales);


export default router;
