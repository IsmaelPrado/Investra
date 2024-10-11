// src/models/CourseModel.ts
import pool from '../config';

export interface Course {
  CursoID: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Duracion: number; // en horas
  URLImagen: string;
  FechaCreacion: Date;
  Calificacion: number;
  Nivel: string;
  Autor: string;
  Idioma: string;
  Aprendizajes: string; // Almacena aprendizajes en formato JSON
}

export const obtenerTodosLosCursos = async (): Promise<Course[]> => {
    const result = await pool.query('SELECT * FROM cursos');
    console.log('Cursos obtenidos:', result.rows); // Añadir un log para verificar los datos
    return result.rows; 
};

