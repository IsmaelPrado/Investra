// src/routes/assetRoutes.ts
import { Router } from 'express';
import { getAssets, createAsset, getAssetById } from '../../controllers/Simulation/assetController';

const router = Router();

// Ruta para obtener todos los activos
router.get('/activos', getAssets);

// Ruta para crear un nuevo activo
router.post('/activos', createAsset);
router.post('/activos/:id', getAssetById)

export default router;
