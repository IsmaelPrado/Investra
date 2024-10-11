// src/routes/courseRoutes.ts
import { Router } from 'express';
import { obtenerCursos } from '../controllers/courseController';

const router = Router();

router.get('/', obtenerCursos);

export default router;
