// src/controllers/EncuestaController.ts
import { Request, Response } from 'express';
import { obtenerTodasLasPreguntas } from '../models/questionModel';
import { guardarRespuesta, obtenerRespuestasPorUsuario } from '../models/responseModel';
import { actualizarEstadoEncuesta } from '../models/userModel';
import { obtenerActivosPorRiesgo } from '../models/Simulation/assetModel';


export const obtenerPreguntas = async (req: Request, res: Response): Promise<void> => {
  try {
    const preguntas = await obtenerTodasLasPreguntas();
    res.status(200).json(preguntas);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ message: 'Error al obtener preguntas' });
  }
};

export const guardarRespuestas = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, respuestas } = req.body;

  try {
    for (const respuesta of respuestas) {
      await guardarRespuesta({ ...respuesta, id_usuario });
    }

    // Actualiza el estado de la encuesta a true después de guardar las respuestas
    const usuarioActualizado = await actualizarEstadoEncuesta(id_usuario);
    
    // Respuesta al cliente
    res.status(201).json({
      message: 'Respuestas guardadas exitosamente',
      usuarioActualizado, // Devuelve el usuario actualizado si lo deseas
    });
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    res.status(500).json({ message: 'Error al guardar respuestas' });
  }
};

//Obtener las respuesta por usuario id para el algoritmo de recomendación
export const obtenerRespuestas = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  try {
    const respuestas = await obtenerRespuestasPorUsuario(Number(id_usuario));
    res.status(200).json(respuestas);
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    res.status(500).json({ message: 'Error al obtener respuestas' });
  }
};

interface Respuestas {
  riesgo: string; // 'B', 'M' o 'A'
  salario: number; // Salario mensual
  porcentajeInversion: number; // Porcentaje del salario a invertir
  tiempoInversion: number; // Tiempo de inversión (en días)
}


export const recomendarActivos = async (id_usuario: number) => {
  // Obtener respuestas del usuario
  const respuestas = await obtenerRespuestasPorUsuario(id_usuario);

  // Mapear respuestas a un objeto de respuestas
  const respuestasUsuario: Respuestas = {
    riesgo: respuestas.find(res => res.id_pregunta === 1)?.respuesta || 'B', // Riesgo
    salario: Number(respuestas.find(res => res.id_pregunta === 2)?.respuesta) || 0, // Salario
    porcentajeInversion: Number(respuestas.find(res => res.id_pregunta === 3)?.respuesta) || 0, // Porcentaje
    tiempoInversion: Number(respuestas.find(res => res.id_pregunta === 4)?.respuesta) || 0, // Tiempo
  };

  // Calcular la inversión disponible
  const inversionDisponible = (respuestasUsuario.salario * (respuestasUsuario.porcentajeInversion / 100)) / (respuestasUsuario.tiempoInversion === -1 ? 30 : respuestasUsuario.tiempoInversion);

  // Obtener activos según el riesgo
  const activosRecomendados = await obtenerActivosPorRiesgo(respuestasUsuario.riesgo);

  return {
    inversionDisponible,
    activosRecomendados,
  };
};