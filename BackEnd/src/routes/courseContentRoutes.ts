// src/routes/courseRoutes.ts
import { Router } from 'express';
import { obtenerDetallesCursosComprados, obtenerModulosCursoEspecifico, obtenerSubmodulosCursoEspecifico } from '../controllers/courseContentController'; // Asegúrate de que el path sea correcto

const router = Router();

// Ruta para obtener los cursos comprados por un usuario específico
router.post('/', obtenerDetallesCursosComprados)
router.post('/module', obtenerModulosCursoEspecifico)
router.post('/submodule', obtenerSubmodulosCursoEspecifico)

export default router;
