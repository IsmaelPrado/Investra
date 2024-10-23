// src/routes/EncuestaRoutes.ts
import { Router } from 'express';
import { guardarRespuestas, obtenerPreguntas, recomendarActivos } from '../controllers/interviewController';

const router = Router();

router.get('/preguntas', obtenerPreguntas);
router.post('/respuestas', guardarRespuestas);

// Ruta para recomendar activos basado en el ID del usuario
router.get('/recomendaciones/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
  
    try {
      const recomendaciones = await recomendarActivos(Number(id_usuario));
      res.status(200).json(recomendaciones);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      res.status(500).json({ message: 'Error al obtener recomendaciones' });
    }
  });

export default router;