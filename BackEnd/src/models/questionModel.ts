// src/models/QuestionModel.ts
import pool from '../config';

export interface Question {
  id: number;
  texto: string;
  tipo_respuesta: string;
}

export const obtenerTodasLasPreguntas = async (): Promise<Question[]> => {
  const result = await pool.query('SELECT * FROM preguntas');
  return result.rows;
};
