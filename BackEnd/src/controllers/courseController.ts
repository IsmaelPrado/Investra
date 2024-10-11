// src/controllers/CourseController.ts
import { Request, Response } from 'express';
import { obtenerTodosLosCursos, Course } from '../models/courseModel';

export const obtenerCursos = async (req: Request, res: Response) => {
    try {
        const cursos: Course[] = await obtenerTodosLosCursos();
        res.status(200).json(cursos);
    } catch (error) {
        console.error('Error al obtener cursos:', error); // Añadir un log para ayudar en el diagnóstico
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
};

