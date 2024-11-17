import { Router } from 'express';
import { crearHistorial, obtenerHistorial } from '../../controllers/Simulation/historyAssetsController';


const router = Router();

// Ruta para crear un nuevo historial de inversión
router.post('/historial', crearHistorial);

// Ruta para obtener el historial de inversiones por usuario
router.get('/historial/usuario/:id', obtenerHistorial);

export default router;
