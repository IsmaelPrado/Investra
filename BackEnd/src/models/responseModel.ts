// src/models/ResponseModel.ts
import pool from '../config';

export interface Response {
  id: number;
  id_usuario: number;
  id_pregunta: number;
  respuesta: string;
}

export const guardarRespuesta = async (respuesta: Response): Promise<void> => {
  await pool.query(
    'INSERT INTO respuestas (id_usuario, id_pregunta, respuesta) VALUES ($1, $2, $3)',
    [respuesta.id_usuario, respuesta.id_pregunta, respuesta.respuesta]
  );
};

// Método para obtener respuestas por ID de usuario
export const obtenerRespuestasPorUsuario = async (id_usuario: number): Promise<Response[]> => {
  const result = await pool.query('SELECT * FROM respuestas WHERE id_usuario = $1', [id_usuario]);
  return result.rows;
};